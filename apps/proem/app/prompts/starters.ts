import LlmModels, { SourceProduct } from "@proemial/adapters/llm/models";
import { generateText } from "ai";

export const prompt = (title: string, abstract: string) =>
	`
You are a helpful assistant who can explain scientific concepts in terms that allow researchers from one scientific domain to grasp and be inspired by ideas from another domain.

Analyse the following scientific article with title: \"${title}\" and abstract: \"${abstract}\". Respond to this message with "OK".. Respond to this message with "OK".

Produce three straightforward, one-line questions about this abstract that you can answer yourself, using plain language.
`.trim();

export async function summariseStarters(
	title: string,
	abstract: string,
	source?: SourceProduct,
) {
	const res = await generateText({
		model: await LlmModels.read.starters(source),
		prompt: prompt(title, abstract),
	});

	const starters = asArray(res.text);

	return starters;
}

// {text: "1. xxx\n2. xxx\n 3. xxx"} > ["xxx", "xxx", "xxx"]
function asArray(text: string) {
	if (!text[0]?.match(/^\d/)) {
		return [text];
	}
	const array = text
		.split("\n")
		.map((str) => str.substring(3))
		.filter((str) => str.includes("?"));

	return array;
}
