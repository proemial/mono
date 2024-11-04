import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { ReferencedPaper } from "@proemial/adapters/redis/news";
export const generateFactsAndQuestions = async (
	transcript: string,
	query: string,
	papers: ReferencedPaper[],
): Promise<string> => {
	try {
		const { text, usage } = await generateText({
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
Create a 60 word commentary reflecting on the main issue of the original transcript, using the scientific facts, rephrased to relate directly to the original transcript. Use layman's language intended for a high school audience and retain the numbered references to the abstracts in the commentary.
</task_1>

<task_2>
Create six questions of a universal nature on the topic of the transcript that can be answered using discoveries in the abstracts. Make the questions easy to understand, in a voice of an engaging news journalist, using a maximum of 10 words.

For each question, write a short and intriguing answer in two sentences, using layman's terminology, that makes the reader curious to learn more. It's imperative that you include numerical references to the abstracts when quoting text or sources, using brackets: [#].

Output a list of questions with each answer on a separate indented line item below each question.
</task_2>
			`,
				},
			],
		});
		console.log("[generateFactsAndQuestions]", usage);
		return text;
	} catch (e) {
		console.error("[news][generateFactsAndQuestions] failed", e);
		throw new Error("[news][generateFactsAndQuestions] failed", {
			cause: { error: e },
		});
	}
};
