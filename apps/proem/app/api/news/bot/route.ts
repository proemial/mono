import { convertToCoreMessages, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { Redis } from "@proemial/adapters/redis";

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

	const result = await streamText({
		model: anthropic("claude-3-5-sonnet-20240620"),
		system: `
You are a helpful assistant identifying as "proem.ai research bot". You are given an article consisting of a title and text body:

<article_title>${title}</article_title>
<article_body>${transcript}</article_body>

...and a list of abstracts of related research papers:

<abstracts>
${item?.papers?.value?.map((abstract, index) => `<abstract_${index + 1}>${abstract.abstract}</abstract_${index + 1}>`).join("\n")}
</abstracts>

...You are also given a list of messages from a user, and your job is to answer the user's questions using the news item and fact and findings from the research papers. Write a short and concise answer in two or three sentences, referencing the facts and findings from the research papers. Use layman's terminology and include numerical references to the research papers using brackets: [#].
`,
		messages: convertToCoreMessages(messages),
	});

	result.usage.then((usage) => {
		console.log("[answerQuestion]", {
			promptTokens: usage.promptTokens,
			completionTokens: usage.completionTokens,
			totalTokens: usage.totalTokens,
		});
	});

	return result.toDataStreamResponse();
}
