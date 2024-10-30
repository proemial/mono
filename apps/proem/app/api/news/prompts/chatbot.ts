import { anthropic } from "@ai-sdk/anthropic";
import { CoreMessage, streamText } from "ai";
import { NewsItem } from "@proemial/adapters/redis/news";

export const chatbot = async (item: NewsItem, messages: CoreMessage[]) => {
	return await streamText({
		model: anthropic("claude-3-5-sonnet-20240620"),
		system: `
You are a helpful assistant identifying as "proem.ai research bot". You are given a news item consisting of a title and content, and news source, and a list of abstracts of scientific research papers that relate to the news item:

<news_item>
<title>
${item.generated?.title}
</title>
<content>
${item.source?.text}
</content>
</news_item>

<abstracts>
${item.references?.map((abstract, index) => `<abstract_${index + 1}>${abstract.abstract}</abstract_${index + 1}>`).join("\n")}
</abstracts>

You are also given a list of messages from a user, and your job is to answer the user's questions using the news item and the abstracts. Unless user asks for a more detailed answer, your answer should be short and concise and not exceed 20 words. When using information from the abstracts, you must cite them using superscript numbers.
`,
		messages,
	});
};
