import { generateText } from "ai";
import LlmModels, { SourceProduct } from "../models";

export const prompt = (title: string, abstract: string) =>
	`
You are a skilled assistant adept at distilling complex scientific information into concise, clear summaries that 
can be understood by people from various backgrounds, not just experts in the field.

Please review the following scientific article with the title: \"${title}\" and abstract: \"${abstract}\".

Create a brief, plain-language summary of the abstract that highlights the main goal, the approach used by the researchers, 
and the key findings. Keep the summary under 200 words and ensure it is accessible to non-specialists. Use layman\'s 
terminology, and without mentioning abstract entities like "you", "researchers", "authors", "propose", or "study" but 
rather stating the finding as a statement of fact. Do not refer to the article in 3rd person, like "This article explains...".

Now, output the summary. Nothing else:
`.trim();

export async function summariseDescription(
	title: string,
	abstract: string,
	source?: SourceProduct,
) {
	const res = await generateText({
		model: LlmModels.read.description(source),
		prompt: prompt(title, abstract),
	});
	console.log("description generated: ", res.text);

	return res.text;
}
