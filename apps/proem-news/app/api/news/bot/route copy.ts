import { Redis } from "@proemial/adapters/redis";
import { convertToCoreMessages, generateText, Message } from "ai";
import { z } from "zod";
import { fetchPapers, QdrantPaper } from "../annotate/fetch/steps/fetch";
import { LlmAnswer } from "../prompts/answers-and-followups";
import { uuid } from "@proemial/utils/uid";
import {
	logBotBegin,
	logRetrieval,
} from "@proemial/adapters/analytics/helicone";

export async function answerQuestion(url: string, messages: Message[]) {
	const item = await Redis.news.get(url);
	if (!item) {
		return new Response("News item not found", { status: 404 });
	}

	const traceId = uuid();

	const question = messages.findLast(
		(message: Message) => message.role === "user",
	)?.content as string;
	await logBotBegin("assistant", question, traceId);

	type RetrievalResult = Array<QdrantPaper>;

	const result = await generateText({
		model: await LlmAnswer.model(traceId),
		system: LlmAnswer.prompt(item.scrape?.title, item.scrape?.transcript),
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
							return (await fetchPapers(url, query)) as RetrievalResult;
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
