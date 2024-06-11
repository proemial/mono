"use server";

import { OpenAlexMeta } from "@proemial/models/open-alex";
import dayjs from "dayjs";

export async function findPaperIds(query: string) {
	if (!query.length) {
		return [];
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
		`https://api.openalex.org/works?select=id&filter=${oaFilter},title.search:${query}`,
	);

	const json = (await search.json()) as {
		meta: OpenAlexMeta;
		results: { id: string }[];
	};

	return json.results.map((result) => result.id.split("/").at(-1) as string);
}
