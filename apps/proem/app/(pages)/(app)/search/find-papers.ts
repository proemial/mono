"use server";
import { waitFor } from "@/utils/sleep";
import {
	OpenAlexWorkMetadata,
	oaBaseArgs,
	oaBaseUrl,
} from "@proemial/repositories/oa/models/oa-paper";
import { Time } from "@proemial/utils/time";
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
			const papers = [] as OpenAlexWorkMetadata[];

			const typeFilter = "type:types/preprint|types/article";
			const queries = [
				`${oaBaseUrl}?${oaBaseArgs}&filter=doi:${query}`,
				`${oaBaseUrl}?${oaBaseArgs}&filter=locations.landing_page_url:http://arxiv.org/abs/${query}|https://arxiv.org/abs/${query}|${query}`,
				`${oaBaseUrl}?${oaBaseArgs}&filter=${typeFilter},title.search:${query}`,
				`${oaBaseUrl}?${oaBaseArgs}&filter=title.search:${query}`,
			];

			for (let i = 0; i < queries.length; i++) {
				const result = await safeFetchSearchResults(queries[i] as string);
				if (result?.results?.length) {
					papers.push(...(result?.results ?? []));
					break;
				}
				await waitFor((i + 1) * 100);
			}
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
	const begin = Time.now();
	const fetchResult = await fetch(url, {
		headers: {
			Accept: "application/json",
		},
		...options,
	});
	console.log(
		`[${dayjs(begin).format("HH.mm:ss.SSS")}] `,
		url,
		fetchResult.status,
		fetchResult.statusText,
	);

	try {
		return fetchResult.json() as Promise<Result>;
	} catch (error) {
		console.error("Error fetching search results", error);
		console.log(
			fetchResult.status,
			fetchResult.statusText,
			await fetchResult.text(),
		);

		return { results: [] };
	}
};
