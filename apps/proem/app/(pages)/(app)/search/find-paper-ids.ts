"use server";

import { OpenAlexMeta } from "@proemial/models/open-alex";

export async function findPaperIds(query: string) {
	if (!query.length) {
		return [];
	}

	const search = await fetch(
		`https://api.openalex.org/works?select=id&filter=title.search:${query}`,
	);

	const json = (await search.json()) as {
		meta: OpenAlexMeta;
		results: { id: string }[];
	};

	return json.results.map((result) => result.id.split("/").at(-1) as string);
}
