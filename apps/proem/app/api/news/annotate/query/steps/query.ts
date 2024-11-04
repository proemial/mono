import { generateIndexSearchQuery } from "../../../prompts/generate-index-search-query";

export async function generateQuery(transcript: string) {
	try {
		const indexQuery = await generateIndexSearchQuery(transcript);

		const parsedQuery = indexQuery
			.split("<search_query>")[1]
			?.split("</search_query>")[0];

		if (!parsedQuery) {
			throw new Error("[news][query] Failed to parse search query", {
				cause: indexQuery,
			});
		}
		console.log("[query]", trimNewlines(parsedQuery));

		return parsedQuery;
	} catch (e) {
		console.error("[news][query] failed to generate query", e);
		throw new Error("[news][query] failed to generate query", {
			cause: e,
		});
	}
}

// Trims newlines from the beginning and end of a string
const trimNewlines = (text: string): string => {
	return text.replace(/^\n+|\n+$/g, "");
};
