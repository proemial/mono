import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { QdrantPaper } from "../actions";

export const generateFactsAndQuestions = async (
	transcript: string,
	query: string,
	papers: QdrantPaper[],
): Promise<string> => {
	const { text } = await generateText({
		model: anthropic("claude-3-5-sonnet-20240620"),
		messages: [
			{
				role: "user",
				content: `
You are given a transcript and the abstracts of ${papers.length} scientific research papers:

<transcript>
${transcript}
</transcript>

<summary>
${query}
</summary>

<research_papers>
${papers.map((paper, index) => `<abstract_${index + 1}>${paper.abstract}</abstract_${index + 1}>`).join("\n")}
</research_papers>

Now, complete these three tasks, one after the other:

<task_1>
Exclusively using topics and discoveries from the ${papers.length} abstracts, list 5 scientific facts that relate to the main topic discussed in the transcript.

The facts must be short, fascinating and presented using layman's terminology, in a way that makes the reader curious to learn more. It's imperative that you include references to the abstracts when quoting text or sources, using [brackets].
</task_1>

<task_2>
Create a 60 word commentary reflecting on the main issue of the original transcript, using the scientific facts, rephrased to relate directly to the original transcript. Use layman's language and retain the numbered references to the abstracts in the commentary.
</task_2>

<task_3>
Provide 3 interesting scientific questions for the transcript that can be answered based on discoveries in the abstracts. Make the questions easy to understand, in a voice of an engaging news journalist, using a maximum of 10 words.

Answer each question in a short and intriguing way, using layman's terminology, that makes the reader curious to learn more. It's imperative that you include references to the abstracts when quoting text or sources, using supertext.
</task_3>
			`,
			},
		],
	});
	return text;
};
