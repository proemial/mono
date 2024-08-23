import { openaiOrganizations } from "@/app/prompts/openai-keys";
import { env } from "@/env/server";
import OpenAI from "openai";

const model = "gpt-3.5-turbo-0125";

export async function summariseAbstract(title: string, abstract: string) {
	const openai = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
		organization: openaiOrganizations.summarization,
	});

	const completion = await openai.chat.completions.create({
		model,
		messages: [
			{
				role: "assistant",
				content:
					"You are a skilled assistant adept at distilling complex scientific information into concise, clear summaries that can be understood by people from various backgrounds, not just experts in the field. ",
			},
			{
				role: "system",
				content: `Please review the following scientific article with the title: \"${title}\" and abstract: \"${abstract}\".`,
			},
			{
				role: "user",
				content:
					'Create a brief, plain-language summary of the abstract that highlights the main goal, the approach used by the researchers, and the key findings. Keep the summary under 200 words and ensure it is accessible to non-specialists. Use layman\'s terminology, and without mentioning abstract entities like "you", "researchers", "authors", "propose", or "study" but rather stating the finding as a statement of fact. Do not refer to the article in 3rd person, like "This article explains...".',
			},
		],
	});

	return completion.choices[0]?.message.content;
}
