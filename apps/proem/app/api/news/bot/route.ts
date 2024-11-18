import {
	convertToCoreMessages,
	StreamData,
	generateText,
	streamText,
} from "ai";
import { Redis } from "@proemial/adapters/redis";
import { LlmAnswer, LlmFollowups } from "../prompts/answers-and-followups";
import { initLogger, traced, Span } from "braintrust";

initLogger({
	projectName: "proem-news",
	apiKey: process.env.BRAINTRUST_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages, url } = (await req.json()) as {
		messages: { role: "user" | "assistant"; content: string }[];
		url: string;
	};

	if (!url) {
		return new Response("Item not found", { status: 404 });
	}

	return traced(
		(span) => {
			return answerQuestion(url, messages, span);
		},
		{ name: "News Bot" },
	);
}

async function answerQuestion(
	url: string,
	messages: { role: "user" | "assistant"; content: string }[],
	span: Span,
) {
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
		async onFinish(event) {
			const question = messages.at(-1)?.content;
			const answer = event.steps.at(-1)?.text;

			span.log({ input: question, output: answer });

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
					type: "followups",
					value: JSON.stringify({ question, answer, followups }),
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
	messages: { role: "user" | "assistant"; content: string }[],
) {
	if (!question || !answer) return;

	const { text } = await generateText({
		model: LlmFollowups.model(),
		system: LlmFollowups.prompt(question, answer, context),
		messages: convertToCoreMessages(messages),
	});

	const followups =
		text
			.match(/<[^>]*?>(.*?)<\/[^>]*?>/g)
			?.map((match) => match.replace(/<\/?[^>]*?>/g, "")) || undefined;

	console.log("followups", question, answer, followups);

	return followups;
}
