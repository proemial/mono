import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export const generateIndexSearchQuery = async (
	transcript: string,
): Promise<string> => {
	const { text } = await generateText({
		model: anthropic("claude-3-5-sonnet-20240620"),
		messages: [
			{
				role: "user",
				content: `
You will be given a transcript to analyze. Your task is to formulate a single search query that includes the key topics of the transcript. The search query will be used to find scientific research articles that support or are otherwise relevant to these topics, to establish the trustworthiness of the transcript.

<transcript>${transcript}</transcript>

To complete this task, follow these steps:

1. Carefully read through the entire transcript.
2. Identify the main topic or theme of the transcript.
3. Look for the most important ideas, facts, or arguments that support the main topic.
4. Consider any significant data, statistics, or quotes that stand out.
5. Pay attention to the introduction and conclusion, as they often contain key information.
6. Only include the search query in your response, not any other text.

Guidelines for selecting key points:
- Choose points that are central to the transcript's main argument or theme.
- Include information that would be essential for someone to understand the core message of the transcript.
- Prioritize unique or surprising information over common knowledge.
- Ensure the selected points give a balanced representation of the transcript's content.

Write your response in the following format, using commas to partition the search query:

<search_query>
[part 1, part 2, part 3...]
</search_query>
			`,
			},
		],
	});
	return text;
};
