"use server";

import { fetchPapers } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";

type FetchFeedParams = Required<Parameters<typeof fetchPapers>>;

export async function fetchFeed(...args: FetchFeedParams) {
	const fetchedPapers = await fetchPapers(...args);
	console.log(fetchedPapers.map((p) => p.id));

	return { rows: fetchedPapers, nextOffset: args[1].offset + 1 };
}
