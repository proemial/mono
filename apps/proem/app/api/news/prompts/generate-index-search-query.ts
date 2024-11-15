import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const model = () => anthropic("claude-3-5-sonnet-20240620");

export const generateIndexSearchQuery = async (
	transcript: string,
	title: string,
): Promise<string> => {
	try {
		const { text, usage } = await generateText({
			model: model(),
			messages: [
				{
					role: "user",
					content: `
Given the following transcript:

<article_title>${title}</article_title>
<article_body>${transcript}</article_body>

Create a 100 word summary that focuses on the key issue of the article, including whatever is alluded to in the title, and format your response in the following way:

<summary>
summary goes here
</summary>
			`,
				},
			],
		});
		console.log("[generateIndexSearchQuery]", usage);
		console.log("[generateIndexSearchQuery]", text);
		return text;
	} catch (e) {
		console.error("[news][query] generateIndexSearchQuery failed", e);
		throw new Error("[news][query] generateIndexSearchQuery failed", {
			cause: e,
		});
	}
};
