import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { ReferencedPaper } from "@proemial/adapters/redis/news";

const model = () => anthropic("claude-3-5-sonnet-20240620");

export const generateFactsAndQuestions = async (
	transcript: string,
	title: string,
	query: string,
	papers: ReferencedPaper[],
): Promise<string> => {
	try {
		const { text, usage } = await generateText({
			model: model(),
			messages: [
				{
					role: "user",
					content: `
Given an article:

<article_title>${title}</article_title>
<article_body>${transcript}</article_body>

...a summary of that article, which was used as a search query to retrieve related research papers:

<summary>
${query}
</summary>

...and the abstracts of ${papers.length} related scientific research papers:

<research_papers>
${papers.map((paper, index) => `<abstract_${index + 1}>${paper.abstract}</abstract_${index + 1}>`).join("\n")}
</research_papers>

...complete the following three tasks, one after another:

<task_1>
Create a 60 word commentary reflecting on the main issue of the original article. Readers will see the original article title, so start the commentary from there, without directly restating anything already said in the tile. Use facts and findings from the research papers, rephrased to relate directly to the topics of the original article. Use layman's language intended for a high school audience and include numerical references to the research papers in the commentary using brackets: [#].
</task_1>

<task_2>
Create six follow-up questions that let readers of the commentary dive deeper into the topic, and which can be answered using facts and findings from the research papers. Use layman's language intended for a high school audience, and ensure that the questions reflect a broad range of angles into the topic, with both critical and more celebratory question. Use a maximum of 10 words for each question.

Then, for each question, write a short and concise answer in two or three sentences, based on the facts and findings from the research papers. Use layman's terminology and include numerical references to the research papers using brackets: [#].

Output a list of all the questions with each answer on a separate indented line item below each question.
</task_2>

<task_3>
Translate the original title to US English, but keep it around 10 words. if the location is important, and the article isnt about the US, find a way to include the country name in the translated title. 

If the title is already in US English, simply output the original title.
</task_3>
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
