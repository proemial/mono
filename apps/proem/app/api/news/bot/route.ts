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

	const item = await Redis.news2.get(url);

	const result = await streamText({
		model: anthropic("claude-3-5-sonnet-20240620"),
		system: `
You are a helpful assistant identifying as "proem.ai research bot". You are given a news item consisting of a title and content, and news source, and a list of abstracts of scientific research papers that relate to the news item:

<news_item>
<title>
${item?.scrape?.title}
</title>
<content>
${item?.scrape?.transcript}
</content>
</news_item>

<abstracts>
${item?.papers?.value?.map((abstract, index) => `<abstract_${index + 1}>${abstract.abstract}</abstract_${index + 1}>`).join("\n")}
</abstracts>

You are also given a list of messages from a user, and your job is to answer the user's questions using the news item and the abstracts. Unless user asks for a more detailed answer, your answer should be short and concise and not exceed 20 words. When using information from the abstracts, you must cite them using superscript numbers.
`,
		messages: convertToCoreMessages(messages),
	});
	return result.toDataStreamResponse();
}
