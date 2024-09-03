import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function summarise(title: string, abstract: string) {
	const prompt = `
You will be summarizing a research paper into a captivating summary in 20 words or less. The goal is to capture the main finding or most significant aspect of the research in a concise, attention-grabbing manner.

Here is the text of the research paper:

<paper>
	<title>${title}</title>
	<abstract>${abstract}</abstract>
</paper>

To create an effective headline summarizing this research paper, follow these steps:

1. Carefully read through the entire paper, paying special attention to the abstract, introduction, results, and conclusion sections.

2. Identify the main research question or hypothesis being addressed in the paper.

3. Determine the most significant finding or conclusion of the study.

4. Consider the potential impact or implications of this research.

Guidelines for creating the headline:

- Keep it under 20 words.
- Use active voice and strong verbs.
- Avoid jargon or overly technical language.
- Focus on the most newsworthy or surprising aspect of the research.
- Use Layman's terminology and avoid mentioning abstract entities like "you", "researchers", "authors", "propose", or "study".
- Focus on keeping the content extremely engaging and exaggerating the wow effect.
	`.trim();

	const res = await generateText({
		model: anthropic("claude-3-haiku-20240307"),
		prompt,
	});

	return res.text;
}
