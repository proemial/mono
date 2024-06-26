"use server";

import {
	OpenAlexWorkMetadata,
	oaBaseArgs,
	oaBaseUrl,
} from "@proemial/repositories/oa/models/oa-paper";
import dayjs from "dayjs";

export async function findPapers(query: string) {
	if (!query.length) {
		return { results: [] };
	}

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

	const search = await fetch(
		`${oaBaseUrl}?${oaBaseArgs}&filter=${oaFilter},title.search:${query}`,
	);
	console.log(
		`${oaBaseUrl}?${oaBaseArgs}&filter=${oaFilter},title.search:${query}`,
	);

	const papers = (await search.json()) as { results: OpenAlexWorkMetadata[] };
	return {
		results: papers.results.map((paper) => ({
			...paper,
			id: paper.id.split("/").at(-1) as string,
		})),
	};
}
