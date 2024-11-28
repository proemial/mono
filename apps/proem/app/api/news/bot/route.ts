import { Redis } from "@proemial/adapters/redis";
import {
	convertToCoreMessages,
	generateText,
	Message,
	StreamData,
	streamText,
} from "ai";
import { z } from "zod";
import { fetchPapers } from "../annotate/fetch/steps/fetch";
import { LlmAnswer, LlmFollowups } from "../prompts/answers-and-followups";
import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { uuid } from "@proemial/utils/uid";

export const maxDuration = 300;

export async function POST(req: Request) {
	const { messages, url } = (await req.json()) as {
		messages: Message[];
		url: string;
	};

	if (!url) {
		return new Response("News URL not found", { status: 404 });
	}

	return answerQuestion(url, messages);
}

async function answerQuestion(url: string, messages: Message[]) {
	const item = await Redis.news.get(url);
	if (!item) {
		return new Response("News item not found", { status: 404 });
	}

	const streamingData = new StreamData();

	const traceId = uuid();

	const result = await streamText({
		model: LlmAnswer.model(traceId),
		system: LlmAnswer.prompt(item.scrape?.title, item.scrape?.transcript),
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

					console.log("[searchPapers]", query);
					const papers = await fetchPapers(url, query);
					console.log("[searchPapers] result", papers.length);

					const mapped = papers.map(
						(paper) =>
							({
								id: paper.id,
								title: paper.title,
								abstract: paper.abstract,
								primary_location: paper.primary_location,
								authorships: paper.authorships,
								created: paper.created,
								published: paper.published,
							}) as ReferencedPaper,
					);

					streamingData.append({
						type: "retrieval-end",
						value: JSON.stringify({ question, papers: JSON.stringify(mapped) }),
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
				traceId,
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
	id: string,
) {
	if (!question || !answer) return;

	// Handle claude error: Requests which include `tool_use` or `tool_result` blocks must define tools.
	const toolLessMessages = messages.filter((m) => !m.toolInvocations);

	const { text } = await generateText({
		model: LlmFollowups.model(id),
		system: LlmFollowups.prompt(question, answer, context),
		messages: convertToCoreMessages(toolLessMessages),
	});

	const followups =
		text
			.match(/<[^>]*?>(.*?)<\/[^>]*?>/g)
			?.map((match) => match.replace(/<\/?[^>]*?>/g, "")) || undefined;

	return followups;
}
