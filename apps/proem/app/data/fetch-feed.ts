"use server";
import { summarise } from "@/app/prompts/summarise-title";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Redis } from "@proemial/redis/redis";
import { fetchAndRerankPaperIds } from "./fetch-by-features";
import { RankedPaper } from "@proemial/repositories/oa/fingerprinting/rerank";
import { fetchPaper } from "../(pages)/(app)/paper/oa/[id]/fetch-paper";

type FetchFeedParams = Required<Parameters<typeof fetchAndRerankPaperIds>>;

export async function fetchFeedByFeatures(
	params: FetchFeedParams[0],
	options: Omit<FetchFeedParams[1], "limit">,
	nocache?: boolean,
) {
	const nextOffset = (options?.offset ?? 1) + 1;
	const { meta, rankedIds } = await fetchAndRerankPaperIds(
		params,
		{
			...options,
			limit: 5,
		},
		nocache,
	);

	if (!rankedIds.length) {
		throw new Error("No papers found.");
	}

	const cachedPapers = await Redis.papers.getAll(
		rankedIds.map((rankedId) => rankedId?.id).filter(Boolean),
	);

	const cachedPapersIds = cachedPapers
		.map((cachedPaper) =>
			// we only consider a cachedPaper valid if it has a generated title
			cachedPaper?.generated?.title ? cachedPaper?.id : null,
		)
		.filter(Boolean);

	const cacheMisses = rankedIds.filter(
		(rankedPaper) => !cachedPapersIds.includes(rankedPaper.id),
	);

	if (cacheMisses.length === 0) {
		return {
			count: meta.count,
			rows: rankedIds.map(
				(rankedPaper) =>
					({
						...rankedPaper,
						paper: cachedPapers.find(
							(cachedPaper) => cachedPaper?.id === rankedPaper.id,
						),
					}) as RankedPaper,
			),
			nextOffset,
		};
	}

	const enhancedPapers = await Promise.all(
		rankedIds.map(async (rankedId) => {
			const paper = await fetchPaper(rankedId.id);
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
					...rankedId,
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
