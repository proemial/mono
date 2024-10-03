import { anthropic } from "@ai-sdk/anthropic";
import { Time } from "@proemial/utils/time";
import { generateText } from "ai";

export async function summariseTitle(title: string, abstract: string) {
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

	const begin = Time.now();
	try {
		const res = await generateText({
			model: anthropic("claude-3-haiku-20240307"),
			prompt,
		});

		return res.text;
	} finally {
		Time.log(begin, `summarised ${title}`);
	}
}

export async function summariseAbstract(title: string, abstract: string) {
	const prompt = `
You are a skilled assistant adept at distilling complex scientific information into concise, clear summaries that can be understood by people from various backgrounds, not just experts in the field. 

Please review the following scientific article:

<paper>
	<title>${title}</title>
	<abstract>${abstract}</abstract>
</paper>

Create a brief, plain-language summary of the abstract that highlights the main goal, the approach used by the researchers, and the key findings. Keep the summary under 200 words and ensure it is accessible to non-specialists. Use layman\'s terminology, and without mentioning abstract entities like "you", "researchers", "authors", "propose", or "study" but rather stating the finding as a statement of fact. Do not refer to the article in 3rd person, like "This article explains...".

Guidelines for creating the summary:

- Keep it under 200 words.
- Use active voice and strong verbs.
- Avoid jargon or overly technical language.
- Focus on the most newsworthy or surprising aspect of the research.
- Use Layman's terminology and avoid mentioning abstract entities like "you", "researchers", "authors", "propose", or "study".
- Focus on keeping the content extremely engaging and exaggerating the wow effect.
	`.trim();

	const begin = Time.now();
	try {
		const res = await generateText({
			model: anthropic("claude-3-haiku-20240307"),
			prompt,
		});

		return res.text;
	} finally {
		Time.log(begin, `summarised ${title}`);
	}
}
