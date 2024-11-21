import {
	convertToCoreMessages,
	StreamData,
	generateText,
	streamText,
	Message,
} from "ai";
import { Redis } from "@proemial/adapters/redis";
import { z } from "zod";
import { qdrantQuery } from "../../bot/ask2/tools";
import { LlmAnswer, LlmFollowups } from "../prompts/answers-and-followups";

// Allow streaming responses up to two minutes
export const maxDuration = 120;

export async function POST(req: Request) {
	const { messages, url } = (await req.json()) as {
		messages: Message[];
		url: string;
	};

	if (!url) {
		return new Response("Item not found", { status: 404 });
	}

	return answerQuestion(url, messages);
}

async function answerQuestion(url: string, messages: Message[]) {
	const item = await Redis.news.get(url);
	const streamingData = new StreamData();

	const result = await streamText({
		model: LlmAnswer.model(),
		system: LlmAnswer.prompt(
			item?.scrape?.title,
			item?.scrape?.transcript,
			item?.papers?.value,
		),
		messages: convertToCoreMessages(messages),
		tools: {
			searchPapers: {
				description: "Find specific research papers matching a user query",
				parameters: z.object({
					question: z.string().describe("The actual user question"),
					query: z.string().describe("The search query"),
				}),
				execute: async ({ question, query }) => {
					streamingData.append({
						type: "retrieval-begin",
						value: JSON.stringify({ question }),
					});

					const papers = await qdrantQuery(query);

					streamingData.append({
						type: "retrieval-end",
						value: JSON.stringify({ question, papers }),
					});

					return papers;
				},
			},
		},
		maxSteps: 5,
		async onFinish(event) {
			const question = messages.at(-1)?.content;
			const answer = event.steps.at(-1)?.text;

			streamingData.append({
				type: "followups-begin",
				value: JSON.stringify({ question }),
			});

			const followups = await generateFollowups(
				question,
				answer,
				{
					title: item?.scrape?.title,
					transcript: item?.scrape?.transcript,
					papers: item?.papers?.value,
				},
				messages,
			);

			if (followups) {
				streamingData.append({
					type: "followups-end",
					value: JSON.stringify({ question, followups }),
				});
			}

			streamingData.close();
		},
	});

	result.usage.then((usage) => {
		console.log("[answerQuestion]", {
			promptTokens: usage.promptTokens,
			completionTokens: usage.completionTokens,
			totalTokens: usage.totalTokens,
		});
	});

	return result.toDataStreamResponse({
		data: streamingData,
	});
}

async function generateFollowups(
	question: string | undefined,
	answer: string | undefined,
	context: {
		title?: string;
		transcript?: string;
		papers?: { abstract: string }[];
	},
	messages: Message[],
) {
	if (!question || !answer) return;

	// Handle claude error: Requests which include `tool_use` or `tool_result` blocks must define tools.
	const toolLessMessages = messages.filter((m) => !m.toolInvocations);

	const { text } = await generateText({
		model: LlmFollowups.model(),
		system: LlmFollowups.prompt(question, answer, context),
		messages: convertToCoreMessages(toolLessMessages),
	});

	const followups =
		text
			.match(/<[^>]*?>(.*?)<\/[^>]*?>/g)
			?.map((match) => match.replace(/<\/?[^>]*?>/g, "")) || undefined;

	console.log("followups", question, answer, followups);

	return followups;
}
