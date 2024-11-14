import {
	convertToCoreMessages,
	StreamData,
	generateText,
	streamText,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { Redis } from "@proemial/adapters/redis";
import { newsAnswerPrompt, newsFollowupPrompt } from "@/app/prompts/news";

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

	const item = await Redis.news.get(url);
	const streamingData = new StreamData();

	const result = await streamText({
		model: anthropic("claude-3-5-sonnet-20240620"),
		system: newsAnswerPrompt(
			item?.scrape?.title,
			item?.scrape?.transcript,
			item?.papers?.value,
		),
		messages: convertToCoreMessages(messages),
		async onFinish(event) {
			const question = messages.at(-1)?.content;
			const answer = event.steps.at(-1)?.text;

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
		model: anthropic("claude-3-5-haiku-latest"),
		system: newsFollowupPrompt(question, answer, context),
		messages: convertToCoreMessages(messages),
	});

	const followups =
		text
			.match(/<[^>]*?>(.*?)<\/[^>]*?>/g)
			?.map((match) => match.replace(/<\/?[^>]*?>/g, "")) || undefined;

	console.log("followups", question, answer, followups);

	return followups;
}
