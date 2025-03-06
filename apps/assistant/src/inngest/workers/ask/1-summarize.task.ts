import { proxyToN8n } from "@/app/api/events/(n8n)/n8nProxy";
import { AskRouter } from "@/inngest/routing";
import { statusMessages } from "@/inngest/status-messages";
import { LlmAnswer } from "@/prompts/ask/summarize-prompts";
import {
	logBotBegin,
	logRetrieval,
} from "@proemial/adapters/analytics/helicone";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { getThreadMessagesForAi } from "@proemial/adapters/slack/helpers/thread";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { Time } from "@proemial/utils/time";
import { uuid } from "@proemial/utils/uid";
import { CoreMessage, CoreUserMessage, generateText } from "ai";
import { z } from "zod";
import { inngest } from "../../client";
import { SlackAskEvent } from "../../workers";
import { Metrics } from "../metrics";
import { LlmSteps, extractPapers } from "../helpers/extract-references";
import { Slack } from "../helpers/slack";

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
			prompt: LlmAnswer.prompt(),
			messages: mappedMessages,
		});
	}

	return await summarizeAnswerTask(metadata, payload, {
		prompt: LlmAnswer.prompt(),
		messages: mappedMessages,
	});
};

export async function summarizeAnswerTask(
	metadata: SlackEventMetadata,
	payload: SlackAskEvent,
	input: { messages: CoreMessage[]; prompt: string },
) {
	const begin = Time.now();

	let { answer, papers } = await answerQuestion(
		metadata,
		input.messages,
		input.prompt,
	);
	console.log("answer", answer, papers?.length);

	// First, find all citation groups (anything within square brackets)
	const citationRegex = /\[([\d\s,]+)\]/g;
	answer = answer.replace(citationRegex, (match, numbers) => {
		// Split the numbers and handle each citation
		const citations = numbers.split(",").map((num: string) => {
			const i = Number.parseInt(num.trim());
			const paper = papers?.[i];
			return paper ? `[${i}](${paper.url})` : num.trim();
		});

		// Rejoin with the original separators (commas and spaces)
		return `[${citations.join(", ")}]`;
	});

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

async function answerQuestion(
	metadata: SlackEventMetadata,
	messages: CoreMessage[],
	prompt: string,
) {
	const traceId = uuid();

	const question = messages.findLast(
		(message: CoreMessage) => message.role === "user",
	)?.content as string;
	await logBotBegin("assistant", question, traceId);

	type RetrievalResult = Array<QdrantPaper>;

	const result = await generateText({
		model: await LlmAnswer.model(traceId, {
			slackAppId: metadata.appId,
		}),
		system: prompt,
		messages,
		tools: {
			searchPapers: {
				description: "Find specific research papers matching a user query",
				parameters: z.object({
					query: z.string().describe("The search query"),
				}),
				execute: async ({ query }) => {
					await Slack.updateStatus(metadata, statusMessages.ask.fetch);
					console.log("Retrieving papers", query);
					const papers = (await logRetrieval(
						"assistant",
						query,
						async <RetrievalResult>() => {
							return (await fetchPapers(query)) as RetrievalResult;
						},
						traceId,
					)) as RetrievalResult;
					await Slack.updateStatus(metadata, statusMessages.ask.summarize);

					console.log("Papers retrieved", papers.length);

					return { papers };
				},
			},
		},
		maxSteps: 5,
	});

	return {
		answer: result.text,
		papers: extractPapers(result as LlmSteps),
	};
}

export type SearchResult = {
	papers: QdrantPaper[];
};

export type QdrantPaper = ReferencedPaper & {
	score: number;
	features: Feature[];
};

type Feature = {
	id: string;
	label: string;
	score: number;
	type: "topic" | "keyword" | "concept";
};

export async function fetchPapers(query: string) {
	try {
		// const embeddings = await generateEmbedding(LlmModels.news.embeddings(), [query]);
		// const { papers } = await QdrantPapers.search(embeddings);
		const result = await fetch("https://index.proem.ai/api/search", {
			method: "POST",
			body: JSON.stringify({
				query: query as string,
				from: "2024-01-01",
				extended: true,
			}),
		});
		const { papers } = (await result.json()) as SearchResult;

		return papers;
	} catch (e) {
		console.error("[news][fetch] failed to fetch papers", e);
		throw new Error("[news][fetch] failed to fetch papers", {
			cause: {
				error: e,
			},
		});
	}
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
