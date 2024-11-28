import { generateText } from "ai";
import LlmModels, { SourceProduct } from "../models";

export const prompt = (title: string, abstract: string) =>
	`
You will be summarizing research papers into captivating headlines. The goal is to capture the societal impact of the main finding of the paper in a concise, news worthy, tweet-like, and attention-grabbing sentence.

Here is the text of the research paper:

<paper>
	<title>${title}</title>
	<abstract>${abstract}</abstract>
</paper>

First, carefully consider the societal impact and possible consequences of the presented findings. Consider all the ways this research could change the world or the living conditions for a large population group.

Then, create a captivating news headline for the paper by following these guidelines:

- Focus on possible consequences of the findings. 
- Use captivating language in the style of a tweet, avoiding technical jargon.
- Present the findings without reservations.
- Avoid entities like "you", "researchers", "authors", "propose", "study", "breakthrough", "revolutionizing".
- Keep the headline around 12 words.

Now, output the headline. Nothing else:
`.trim();

export const model = LlmModels.read.title().modelId;

export async function summariseTitle(
	title: string,
	abstract: string,
	source?: SourceProduct,
) {
	const res = await generateText({
		model: LlmModels.read.title(source),
		prompt: prompt(title, abstract),
	});

	return res.text;
}
