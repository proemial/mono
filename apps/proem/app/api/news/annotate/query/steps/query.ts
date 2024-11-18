import { generateIndexSearchQuery } from "../../../prompts/generate-index-search-query";
import { Span } from "@/components/analytics/braintrust/llm-trace";

export async function generateQuery(
	url: string,
	transcript: string,
	title: string,
	trace: Span,
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
		console.log("trace", trace.id);

		trace.log({
			input: title,
			output: trimNewlines(parsedQuery),
			metadata: {
				url,
			},
			tags: ["annotate"],
		});

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
