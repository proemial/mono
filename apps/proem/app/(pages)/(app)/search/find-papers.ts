"use server";

import {
	OpenAlexMeta,
	OpenAlexPaper,
	OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";
import { fromInvertedIndex } from "@proemial/utils/string";
import { generate } from "../paper/oa/[id]/llm-generate";
import { fetchPaper } from "../paper/oa/[id]/fetch-paper";

export async function findPapers(query: string) {
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

	const papers = [] as OpenAlexPaper[];
	for (const id of json.results.map((p) => p.id.split("/").at(-1) as string)) {
		let paper = await fetchPaper(id);
		// console.log(paper?.id, paper?.generated?.title);

		if (paper && !paper.generated) {
			paper = await generate(paper);
			// await waitfor(500);
		}
		if (paper) {
			papers.push(paper);
		}
	}

	// [upsert] pushing paper https://openalex.org/W2114605393
	// [upsert] pushing paper https://openalex.org/W2052090449
	// [upsert] pushing paper https://openalex.org/W2626778328
	// [upsert] pushing paper https://openalex.org/W3171087525
	// [upsert] pushing paper https://openalex.org/W3163652268
	// [upsert] pushing paper https://openalex.org/W2997150500
	// [upsert] pushing paper https://openalex.org/W4385245566
	// [upsert] pushing paper https://openalex.org/W2963403868
	// [upsert] pushing paper https://openalex.org/W3122843332

	// const mapped = json?.results
	// 	.slice(0, 10)
	// 	.map((paper: OpenAlexWorkMetadata) => {
	// 		return {
	// 			id: paper.id.split("/").at(-1) as string,
	// 			data: {
	// 				...paper,
	// 				abstract: fromInvertedIndex(paper.abstract_inverted_index, 350),
	// 			},
	// 		} as OpenAlexPaper;
	// 	});
	// const withGenerated = await Promise.all(
	// 	mapped.map(async (paper) => {
	// 		return await generate(paper);
	// 	}),
	// );
	// console.log(
	// 	"withGenerated",
	// 	withGenerated.map((p) => `${p.id}: ${p.generated?.title}`),
	// );

	return papers;
}
