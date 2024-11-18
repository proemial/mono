import { generateIndexSearchQuery } from "../../../prompts/generate-index-search-query";

export async function generateQuery(
	url: string,
	transcript: string,
	title: string,
) {
	try {
		const indexQuery = await generateIndexSearchQuery(transcript, title);

		const parsedQuery = indexQuery
			.split("<summary>")[1]
			?.split("</summary>")[0];

		if (!parsedQuery) {
			throw new Error("[news][query] Failed to parse search query", {
				cause: {
					url,
					indexQuery,
				},
			});
		}

		return parsedQuery;
	} catch (e) {
		console.error("[news][query] failed to generate query", e);
		throw new Error("[news][query] failed to generate query", {
			cause: {
				url,
				error: e,
			},
		});
	}
}

// Trims newlines from the beginning and end of a string
const trimNewlines = (text: string): string => {
	return text.replace(/^\n+|\n+$/g, "");
};
