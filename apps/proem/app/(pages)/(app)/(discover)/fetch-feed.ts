"use server";

import { fetchPapersByField } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { summarise } from "@/app/prompts/summarise-title";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Redis } from "@proemial/redis/redis";

type FetchFeedParams = Required<Parameters<typeof fetchPapersByField>>;

export async function fetchFeedByTopic(
	params: FetchFeedParams[0],
	options: Omit<FetchFeedParams[1], "limit">,
) {
	const nextOffset = (options?.offset ?? 1) + 1;
	const { meta, papers } = await fetchPapersByField(params, {
		...options,
		limit: 5,
	});

	if (!papers.length) {
		throw new Error("No papers found.");
	}

	const cachedPapers = await Redis.papers.getAll(
		papers.map((paper) => paper?.id).filter(Boolean),
	);

	const cachedPapersIds = cachedPapers
		.map((cachedPaper) =>
			// we only consider a cachedPaper valid if it has a generated title
			cachedPaper?.generated?.title ? cachedPaper?.id : null,
		)
		.filter(Boolean);

	const cacheMisses = papers.filter(
		(paper) => !cachedPapersIds.includes(paper.id),
	);

	if (cacheMisses.length === 0) {
		return {
			count: meta.count,
			rows: cachedPapers.map((paper) => ({ paper: paper as OpenAlexPaper })),
			nextOffset,
		};
	}

	const enhancedPapers = await Promise.all(
		papers.map(async (paper) => {
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

	return {
		count: meta.count,
		rows: enhancedPapers.map((paper) => ({ paper: paper as OpenAlexPaper })),
		nextOffset,
	};
}
