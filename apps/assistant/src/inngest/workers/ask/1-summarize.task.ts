import { proxyToN8n } from "@/app/api/events/(n8n)/n8nProxy";
import { AskRouter } from "@/inngest/routing";
import { LlmAnswer } from "@/prompts/ask/summarize-prompts";
import { logBotBegin } from "@proemial/adapters/analytics/helicone";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { statusMessages } from "@proemial/adapters/slack/helpers/status-messages";
import { getThreadMessagesForAi } from "@proemial/adapters/slack/helpers/thread";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { Time } from "@proemial/utils/time";
import { uuid } from "@proemial/utils/uid";
import { CoreMessage, CoreUserMessage, generateText } from "ai";
import { inngest } from "../../client";
import { SlackAskEvent } from "../../workers";
import {
	LlmResponse,
	convertSourceRefsToNumberedLinks,
	extractPapers,
} from "../helpers/extract-references";
import { Slack } from "../helpers/slack";
import { Metrics } from "../metrics";
import { getSearchPapersTool } from "../tools/search-papers-tool";
import { getSearchChannelAttachmentsTool } from "../tools/search-channel-attachments-tool";
import { answerParams } from "@/prompts/ask/summarize-prompt";

export const eventName = "ask/summarize";
const eventId = "ask/summarize/fn";

export const askTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, retries: 0 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data } as SlackAskEvent;

			try {
				const result = await taskWorker(payload);
				await Metrics.answer.log(eventName, payload, Time.elapsed(begin));

				return result;
			} catch (error) {
				await Metrics.answer.log(
					eventName,
					payload,
					Time.elapsed(begin),
					(error as Error).message,
				);
				Slack.updateStatus(payload.metadata, (error as Error).message, true);
				throw error;
			} finally {
				Time.log(begin, eventName);
			}
		},
	),
};

const taskWorker = async (payload: SlackAskEvent) => {
	const metadata = payload.metadata as SlackEventMetadata;

	const status = await Slack.updateStatus(
		metadata,
		statusMessages.ask.begin,
		false,
		true,
	);
	payload.metadata.replyTs = status.ts;

	const messages = await getMessages(metadata, payload.question);
	if (messages.length === 0) {
		throw new Error("No messages found");
	}

	const mappedMessages: CoreMessage[] = await Promise.all(
		messages.map(async (m) => {
			const link =
				m.role === "user" && typeof m.content === "string"
					? m.content.match(/^https?:\/\/[^\s]+$/)
					: undefined;
			if (link?.length) {
				const scraped = await SlackDb.scraped.get(link[0]);
				return {
					content: scraped?.content.text ?? (m as CoreUserMessage).content,
					role: "user",
				};
			}
			return m;
		}),
	);

	if (metadata.channelId === "C08F2GPLT2M") {
		console.log("proxyToN8n", metadata, payload, mappedMessages);
		return await proxyToN8n("answer", metadata, payload, {
			prompt: answerParams.prompt,
			messages: mappedMessages,
		});
	}

	return await summarizeAnswerTask(metadata, payload, {
		params: answerParams,
		messages: mappedMessages,
	});
};

export async function summarizeAnswerTask(
	metadata: SlackEventMetadata,
	payload: SlackAskEvent,
	input: { messages: CoreMessage[]; params: typeof answerParams },
) {
	const begin = Time.now();

	const llmResponse = await answerQuestion(
		metadata,
		input.messages,
		input.params,
	);
	const papers = extractPapers(llmResponse);
	console.log("answer", llmResponse.text, papers?.length);
	const answer = convertSourceRefsToNumberedLinks(
		llmResponse.text as string,
		papers,
	);
	console.log("answer with links", answer);

	// Next step from router
	const next = await AskRouter.next(
		eventName,
		payload.thread,
		answer,
		metadata,
	);
	return {
		event: eventName,
		body: {
			answer,
			payload,
			steps: {
				current: eventName,
				next,
			},
			elapsed: Time.elapsed(begin),
		},
	};
}

export async function answerQuestion(
	metadata: SlackEventMetadata,
	messages: CoreMessage[],
	params: typeof answerParams,
) {
	const traceId = uuid();

	const question = messages.findLast(
		(message: CoreMessage) => message.role === "user",
	)?.content as string;
	await logBotBegin("assistant", question, traceId);

	// Create the tools object based on the available tools in params.tools
	const tools: Record<
		string,
		| ReturnType<typeof getSearchPapersTool>
		| ReturnType<typeof getSearchChannelAttachmentsTool>
	> = {};

	// Add each tool if it exists in params.tools
	if ("searchPapers" in params.tools) {
		tools.searchPapers = getSearchPapersTool(
			metadata,
			traceId,
			params.tools.searchPapers,
		);
	}

	if ("searchChannelAttachments" in params.tools) {
		tools.searchChannelAttachments = getSearchChannelAttachmentsTool(
			metadata,
			params.tools.searchChannelAttachments,
		);
	}

	const llmParams = {
		model: await LlmAnswer.model(traceId),
		system: params.prompt,
		messages,
		tools,
		maxSteps: 5,
	};

	return (await generateText(llmParams)) as LlmResponse;
}

async function getMessages(metadata: SlackEventMetadata, question?: string) {
	if (metadata.threadTs) {
		return await getThreadMessagesForAi(metadata);
	}

	if (question) {
		return [
			{
				content: question,
				role: "user",
			} satisfies CoreUserMessage,
		];
	}

	return [];
}
