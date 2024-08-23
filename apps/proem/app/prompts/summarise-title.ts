import { openaiOrganizations } from "@/app/prompts/openai-keys";
import { env } from "@/env/server";
import OpenAI from "openai";

const model = "gpt-3.5-turbo-0125";

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
	organization: openaiOrganizations.summarization,
});

export async function summarise(title: string, abstract: string) {
	const completion = await openai.chat.completions.create({
		model,
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
