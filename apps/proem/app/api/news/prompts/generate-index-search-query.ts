import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export const generateIndexSearchQuery = async (
	transcript: string,
): Promise<string> => {
	const { text, usage } = await generateText({
		model: anthropic("claude-3-5-sonnet-20240620"),
		messages: [
			{
				role: "user",
				content: `
Given the following transcript:

<transcript>${transcript}</transcript>

Create a 100 word summary that focuses on the key issue of the article, and format your response in the following way:

<search_query>
[summary goes here]
</search_query>
			`,
			},
		],
	});
	console.log("[generateIndexSearchQuery]", usage);
	return text;
};
