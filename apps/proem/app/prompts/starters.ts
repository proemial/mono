import { apiKey, organizations } from "@/app/prompts/openai-keys";
import OpenAI from "openai";

const model = "gpt-3.5-turbo";

export async function generateStarters(title: string, abstract: string) {
	const openai = new OpenAI({
		apiKey,
		organization: organizations.summarization,
	});

	const completion = await openai.chat.completions.create({
		model,
		messages: [
			{
				role: "assistant",
				content:
					'You are a helpful assistant who can explain scientific concepts in terms that allow researchers from one scientific domain to grasp and be inspired by ideas from another domain. Respond to this message with "OK"',
			},
			{
				role: "system",
				content: `Analyse the following scientific article with title: \"${title}\" and abstract: \"${abstract}\". Respond to this message with "OK".. Respond to this message with "OK".`,
			},
			{
				role: "user",
				content:
					"Produce three straightforward, one-line questions about this abstract that you can answer yourself, using plain language.",
			},
		],
	});
	return asArray(completion.choices[0]?.message.content as string);
}

// {text: "1. xxx\n2. xxx\n 3. xxx"} > ["xxx", "xxx", "xxx"]
function asArray(text: string) {
	if (!text[0]?.match(/^\d/)) {
		return [text];
	}
	return text.split("\n").map((str) => str.substring(3));
}
