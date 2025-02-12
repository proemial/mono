import { AskRouter } from "@/inngest/routers";
import { LlmAnswer } from "@/prompts/ask/answers-and-followups";
import {
	logBotBegin,
	logRetrieval,
} from "@proemial/adapters/analytics/helicone";
import { Summaries } from "@proemial/adapters/mongodb/slack/scraped.types";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import {
	getThreadMessages,
	getThreadMessagesForAi,
} from "@proemial/adapters/slack/channel";
import { Time } from "@proemial/utils/time";
import { uuid } from "@proemial/utils/uid";
import { uuid5 } from "@proemial/utils/uuid";
import { Message, convertToCoreMessages, generateText } from "ai";
import { z } from "zod";
import { inngest } from "../../client";
import { SlackAskEvent } from "../../models";
import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { nakedLink } from "@proemial/adapters/slack/routing";

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

			if (!payload.thread) {
				throw new Error("No url provided");
			}

			const messages = (await getThreadMessagesForAi(
				payload.metadata?.channel.id as string,
				payload.thread,
				payload.metadata?.team.id as string,
				payload.metadata?.appId as string,
			)) as Message[];

			if (messages.length === 0) {
				throw new Error("No messages found");
			}

			const mappedMessages = (await Promise.all(
				messages.map(async (m) => {
					const link = m.content.slice(1, -1).match(/^https?:\/\/[^\s]+$/);
					if (link?.length) {
						console.log("Fetching scraped link", link[0]);
						const scraped = await SlackDb.scraped.get(link[0]);
						console.log("scraped", scraped?.content.text);
						return {
							...m,
							content: scraped?.content.text ?? m.content,
						};
					}
					return m;
				}),
			)) as Message[];

			const answer = await answerQuestion(mappedMessages);
			console.log("answer", answer);
			// 	await SlackDb.scraped.upsert({
			// 		...scraped,
			// 		summaries: {
			// 			...summaries,
			// 			background: background.commentary,
			// 			engTitle: background.engTitle,
			// 		} as Summaries,
			// 		questions: background.questions,
			// 	});
			// }

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

async function answerQuestion(messages: Message[]) {
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
					const papers = (await logRetrieval(
						"assistant",
						query,
						async <RetrievalResult>() => {
							return (await fetchPapers(query)) as RetrievalResult;
						},
						traceId,
					)) as RetrievalResult;

					return papers;
				},
			},
		},
		maxSteps: 5,
	});

	return result.text;
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
