import { Redis } from "@proemial/adapters/redis";
import { NewsAnnotatorQueryInputStep } from "@proemial/adapters/redis/news";
import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { generateIndexSearchQuery } from "../../prompts/generate-index-search-query";

export const maxDuration = 300; // seconds

export async function POST(req: NextRequest) {
	const { url } = (await req.json()) as { url: string };

	const begin = Time.now();
	try {
		const item = await Redis.news.get(url);
		if (item?.query || !item?.scrape) {
			return NextResponse.json(item);
		}

		const indexQuery = await generateIndexSearchQuery(
			item.scrape?.transcript as string,
		);
		const parsedQuery = indexQuery
			.split("<search_query>")[1]
			?.split("</search_query>")[0];
		if (!parsedQuery) {
			throw new Error("[news][query] Failed to parse search query", {
				cause: indexQuery,
			});
		}
		console.log("[query]", trimNewlines(parsedQuery));

		try {
			const result = await Redis.news.update(url, {
				name: "query",
				value: parsedQuery,
			} as NewsAnnotatorQueryInputStep);

			return NextResponse.json(result);
		} catch (e) {
			console.error("[news][query] failed to update redis", e);
			throw new Error("[news][query] failed to update redis", {
				cause: e,
			});
		}
	} finally {
		Time.log(begin, `[annotator][query] ${url}`);
	}
}

// Trims newlines from the beginning and end of a string
const trimNewlines = (text: string): string => {
	return text.replace(/^\n+|\n+$/g, "");
};
