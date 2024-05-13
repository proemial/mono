"use server";

import { fetchPapers } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { summarise } from "@/app/prompts/summarise-title";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";

type FetchFeedParams = Required<Parameters<typeof fetchPapers>>;
// export const revalidate = 600;

export async function fetchFeed(
	params: FetchFeedParams[0],
	options: Omit<FetchFeedParams[1], "limit">,
) {
	const fetchedPapers = await fetchPapers(params, { ...options, limit: 5 });
	const cachedPapers = await Redis.papers.getAll(
		fetchedPapers.map((paper) => paper.id),
	);

	const cachedPapersIds = cachedPapers
		.map((paper) => paper?.id)
		.filter(Boolean);

	const cacheMisses = fetchedPapers.filter(
		(paper) => !cachedPapersIds.includes(paper.id),
	);

	if (cacheMisses.length === 0) {
		return { rows: cachedPapers, nextOffset: options.offset + 1 };
	}

	const enhancedPapers = await Promise.all(
		fetchedPapers.map(async (paper) => {
			const paperTitle = paper?.data?.title;
			const abstract = paper?.data?.abstract;
			const generatedTitle = paper?.generated?.title;

			if (!generatedTitle && paperTitle && abstract) {
				const title = (await summarise(paperTitle, abstract)) as string;
				const generated = paper.generated
					? { ...paper.generated, title }
					: { title };

				return {
					...paper,
					generated,
				};
			}
		}),
	);

	await Redis.papers.upsertAll(enhancedPapers as OpenAlexPaper[]);

	return { rows: enhancedPapers, nextOffset: options.offset + 1 };
}
