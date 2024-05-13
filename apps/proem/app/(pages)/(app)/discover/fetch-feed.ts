"use server";

import { fetchPapers } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";

type FetchFeedParams = Required<Parameters<typeof fetchPapers>>;

export async function fetchFeed(
	params: FetchFeedParams[0],
	options: Omit<FetchFeedParams[1], "limit">,
) {
	const fetchedPapers = await fetchPapers(params, { ...options, limit: 5 });
	console.log(fetchedPapers.map((p) => p.id));

	return { rows: fetchedPapers, nextOffset: options.offset + 1 };
}
