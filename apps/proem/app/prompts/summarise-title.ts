import { openaiOrganizations } from "@/app/prompts/openai-keys";
import { env } from "@/env/server";
import { summariseModel } from "@/feature-flags/ai-summarise-model-flag";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import OpenAI from "openai";

const openaiClient = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
	organization: openaiOrganizations.summarization,
});

export async function summarise(title: string, abstract: string) {
	const model = await summariseModel();
	if (model === "claude-3-haiku") {
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

5. Distill this information into a single, concise headline that captures the essence of the paper's main contribution to the field.

Guidelines for creating the headline:

- Keep it under 20 words.
- Use active voice and strong verbs.
- Avoid jargon or overly technical language.
- Focus on the most newsworthy or surprising aspect of the research.
- Be accurate and avoid sensationalism or exaggeration.
- Use Layman's terminology and avoid mentioning abstract entities like "you", "researchers", "authors", "propose", or "study".
	`;

		const res = await generateText({
			model: anthropic("claude-3-haiku-20240307"),
			prompt,
		});
		return res.text;
	}

	const completion = await openaiClient.chat.completions.create({
		model: "gpt-3.5-turbo-0125",
		messages: [
			{
				role: "assistant",
				content:
					"You are a helpful assistant who can explain scientific concepts in terms that allow researchers from one scientific domain to grasp and be inspired by ideas from another domain.",
			},
			{
				role: "system",
				content: `Analyse the following scientific article with title: \"${title}\" and abstract: \"${abstract}\"`,
			},
			{
				role: "user",
				content:
					'Write a captivating summary in 20 words or less of the most significant finding for an engaging headline that will capture the minds of other researchers, using layman\'s terminology, and without mentioning abstract entities like "you", "researchers", "authors", "propose", or "study" but rather stating the finding as a statement of fact. Make sure to use 20 words or less.',
			},
		],
	});

	return completion.choices[0]?.message.content;
}
