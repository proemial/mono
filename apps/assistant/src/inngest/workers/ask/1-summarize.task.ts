import { AskRouter } from "@/inngest/routing";
import { LlmAnswer } from "@/prompts/ask/summarize-prompts";
import {
	logBotBegin,
	logRetrieval,
} from "@proemial/adapters/analytics/helicone";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { getThreadMessagesForAi } from "@proemial/adapters/slack/channel";
import { Time } from "@proemial/utils/time";
import { uuid } from "@proemial/utils/uid";
import { Message, convertToCoreMessages, generateText } from "ai";
import { z } from "zod";
import { inngest } from "../../client";
import { SlackAskEvent } from "../../workers";
import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { SlackEventMetadata } from "@proemial/adapters/slack/metadata.models";
import { extractPapers, LlmSteps } from "./extract-references";
import { setStatus } from "@proemial/adapters/slack/assistant";
import { statusMessages } from "@/inngest/status-messages";

export const eventName = "ask/summarize";
const eventId = "ask/summarize/fn";

export const askTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data } as SlackAskEvent;

			const metadata = payload.metadata as SlackEventMetadata;

			const messages = await getMessages(
				metadata,
				payload.thread,
				payload.question,
			);

			if (messages.length === 0) {
				throw new Error("No messages found");
			}

			const mappedMessages = (await Promise.all(
				messages.map(async (m) => {
					const link = m.content.slice(1, -1).match(/^https?:\/\/[^\s]+$/);
					if (link?.length) {
						const scraped = await SlackDb.scraped.get(link[0]);
						return {
							...m,
							content: scraped?.content.text ?? m.content,
						};
					}
					return m;
				}),
			)) as Message[];

			let { answer, papers } = await answerQuestion(metadata, mappedMessages);
			console.log("answer", answer, papers?.length);

			papers?.forEach((p, i) => {
				answer = answer.replace(
					`[${i}]`,
					`<https://proem.ai/paper/oa/${p.id.split("/").at(-1)}|[${i}]>`,
				);
			});
			console.log("answer with links", answer);

			// Next step from router
			const next = await AskRouter.next(
				eventName,
				payload.thread,
				answer,
				payload.metadata,
			);
			return {
				event,
				body: {
					payload,
					steps: {
						current: eventName,
						next,
					},
					elapsed: Time.elapsed(begin),
				},
			};
		},
	),
};

async function answerQuestion(
	metadata: SlackEventMetadata,
	messages: Message[],
) {
	const traceId = uuid();

	const question = messages.findLast(
		(message: Message) => message.role === "user",
	)?.content as string;
	await logBotBegin("assistant", question, traceId);

	type RetrievalResult = Array<QdrantPaper>;

	const result = await generateText({
		model: await LlmAnswer.model(traceId),
		system: LlmAnswer.prompt(),
		messages: convertToCoreMessages(messages),
		tools: {
			searchPapers: {
				description: "Find specific research papers matching a user query",
				parameters: z.object({
					query: z.string().describe("The search query"),
				}),
				execute: async ({ query }) => {
					await setStatus(metadata, statusMessages.ask.fetch);
					console.log("Retrieving papers", query);
					const papers = (await logRetrieval(
						"assistant",
						query,
						async <RetrievalResult>() => {
							return (await fetchPapers(query)) as RetrievalResult;
						},
						traceId,
					)) as RetrievalResult;
					await setStatus(metadata, statusMessages.ask.summarize);
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

async function getMessages(
	metadata: SlackEventMetadata,
	thread?: string,
	question?: string,
): Promise<Message[]> {
	if (thread) {
		await setStatus(metadata, statusMessages.ask.begin);
		return (await getThreadMessagesForAi(metadata, thread)) as Message[];
	}

	if (question) {
		return [
			{
				content: question,
				role: "user",
			},
		] as Message[];
	}

	return [];
}
