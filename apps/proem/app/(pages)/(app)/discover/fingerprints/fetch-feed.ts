"use server";
import { summarise } from "@/app/prompts/summarise-title";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import {
	RankedPaper,
	fetchAndRerankPapers,
} from "@/components/fingerprints/fetch-by-features";

type FetchFeedParams = Required<Parameters<typeof fetchAndRerankPapers>>;

export async function fetchFeed(
	params: FetchFeedParams[0],
	options: Omit<FetchFeedParams[1], "limit">,
) {
	const nextOffset = (options?.offset ?? 1) + 1;
	const { meta, papers: rankedPapers } = await fetchAndRerankPapers(params, {
		...options,
		limit: 5,
	});

	if (!rankedPapers.length) {
		throw new Error("No papers found.");
	}

	const cachedPapers = await Redis.papers.getAll(
		rankedPapers.map((rankedPaper) => rankedPaper.paper?.id).filter(Boolean),
	);

	const cachedPapersIds = cachedPapers
		.map((cachedPaper) =>
			// we only consider a cachedPaper valid if it has a generated title
			cachedPaper?.generated?.title ? cachedPaper?.id : null,
		)
		.filter(Boolean);

	const cacheMisses = rankedPapers.filter(
		(rankedPaper) => !cachedPapersIds.includes(rankedPaper.paper.id),
	);

	if (cacheMisses.length === 0) {
		return {
			count: meta.count,
			rows: rankedPapers.map(
				(rankedPaper) =>
					({
						...rankedPaper,
						paper: cachedPapers.find(
							(cachedPaper) => cachedPaper?.id === rankedPaper.paper.id,
						),
					}) as RankedPaper,
			),
			nextOffset,
		};
	}

	const enhancedPapers = await Promise.all(
		rankedPapers.map(async (rankedPaper) => {
			const paper = rankedPaper.paper;
			const paperTitle = paper?.data?.title;
			const abstract = paper?.data?.abstract;
			const generatedTitle = paper?.generated?.title;

			if (!generatedTitle && paperTitle && abstract) {
				console.log("Enhancing paper", paper.id);
				const title = (await summarise(paperTitle, abstract)) as string;
				const generated = paper.generated
					? { ...paper.generated, title }
					: { title };

				return {
					...rankedPaper,
					paper: { ...paper, generated },
				};
			}
		}),
	);

	await Redis.papers.upsertAll(
		enhancedPapers.map((p) => p?.paper) as OpenAlexPaper[],
	);

	return {
		count: meta.count,
		rows: enhancedPapers as RankedPaper[],
		nextOffset,
	};
}
