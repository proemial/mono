"use server";
import {
	OpenAlexWorkMetadata,
	oaBaseArgs,
	oaBaseUrl,
} from "@proemial/repositories/oa/models/oa-paper";
import dayjs from "dayjs";
import { unstable_cache } from "next/cache";

type Result = { results: OpenAlexWorkMetadata[] };
export type OptionalResult = Result | undefined;

export async function findPapersAction(
	prev: OptionalResult,
	form: FormData,
): Promise<OptionalResult> {
	const query = form.get("query") as string;
	if (!query?.length) {
		return undefined;
	}

	return await findPapers(query);
}

export async function findPapers(query: string) {
	// Cache search results for 60 seconds to avoid redoing identical searches
	// every time a user changes between spaces on the search page.
	return unstable_cache(
		async () => {
			const today = dayjs().format("YYYY-MM-DD");
			const oaFilter = [
				"type:types/preprint|types/article",
				"has_abstract:true",
				`publication_date:<${today}`, // We do not want papers published in the future
				"language:en",
				"open_access.is_oa:true",
			]
				.filter((f) => !!f)
				.join(",");

			const byDoi = await findByDoi(query);
			const byArxiv = await findByArxiv(query);
			const byTitle = await findByTitle(query, oaFilter);

			const papers = [...byDoi.results, ...byArxiv.results, ...byTitle.results];

			return {
				results: papers.map((paper) => ({
					...paper,
					id: paper.id.split("/").at(-1) as string,
				})),
			};
		},
		["papersearch", query],
		{ revalidate: 60 },
	)();
}

/**
 * Returns search results, or an empty results array if the result contains
 * invalid JSON.
 */
const safeFetchSearchResults = async (
	url: string,
	options: RequestInit = {},
) => {
	const fetchResult = await fetch(url, {
		headers: {
			Accept: "application/json",
		},
		...options,
	});
	try {
		return fetchResult.json() as Promise<Result>;
	} catch (error) {
		console.error("Error fetching search results", error);
		return { results: [] };
	}
};

function findByArxiv(query: string): Promise<Result> {
	return safeFetchSearchResults(
		`${oaBaseUrl}?${oaBaseArgs}&filter=locations.landing_page_url:http://arxiv.org/abs/${query}|https://arxiv.org/abs/${query}|${query}`,
	);
}

function findByDoi(query: string): Promise<Result> {
	// This regexp doesn't support doi as url: https://doi.org/10.1111/1475-6773.14324
	// if (!query.match(/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i)) {
	// 	return { results: [] };
	// }
	return safeFetchSearchResults(
		`${oaBaseUrl}?${oaBaseArgs}&filter=doi:${query}`,
	);
}

function findByTitle(query: string, baseFilter: string): Promise<Result> {
	return safeFetchSearchResults(
		`${oaBaseUrl}?${oaBaseArgs}&filter=${baseFilter},title.search:${query}`,
	);
}
