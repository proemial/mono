import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { generateFactsAndQuestions } from "../../../prompts/generate-facts-and-questions";
import { uuid5 } from "@proemial/utils/uuid";

export async function summarise(
	url: string,
	query: string,
	transcript: string,
	title: string,
	papers: ReferencedPaper[],
) {
	try {
		return await generateFactsAndQuestions(
			transcript,
			title,
			query,
			papers,
			uuid5(url, "helicone"),
		);
	} catch (e) {
		console.error("[news][summarise] failed to summarise", e);
		throw new Error("[news][summarise] failed to summarise", {
			cause: { url, error: e },
		});
	}
}
