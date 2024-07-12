"use server";
import { summarise } from "@/app/prompts/summarise-title";
import { PostService } from "@/services/post-service";
import { Redis } from "@proemial/redis/redis";
import { RankedPaper } from "@proemial/repositories/oa/fingerprinting/rerank";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { fetchPaper } from "../(pages)/(app)/paper/oa/[id]/fetch-paper";
import { fetchAndRerankPaperIds } from "./fetch-by-features";

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

	const enhanced = [] as OpenAlexPaper[];
	const rankedPapers = await Promise.all(
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

				enhanced.push({ ...paper, generated });

				return {
					...rankedId,
					paper: { ...paper, generated },
				};
			}
			return {
				...rankedId,
				paper,
			};
		}),
	);

	await Redis.papers.upsertAll(enhanced);

	return {
		count: meta.count,
		rows: rankedPapers as RankedPaper[],
		nextOffset,
	};
}

export const fetchFeedByFeaturesWithPosts = async (
	params: FetchFeedParams[0],
	options: Omit<FetchFeedParams[1], "limit">,
	nocache: boolean | undefined,
	spaceId: string | undefined,
) => {
	const feedByFeatures = await fetchFeedByFeatures(params, options, nocache);
	const paperIds = feedByFeatures.rows.map(({ paper }) => paper.id);
	const papersWithPosts = await PostService.getPaperIdsWithPosts(
		paperIds,
		spaceId,
	);
	return {
		...feedByFeatures,
		rows: feedByFeatures.rows.map((row) => ({
			...row,
			paper: {
				...row.paper,
				posts:
					papersWithPosts.find((paper) => paper.id === row.paper.id)?.posts ??
					[],
			},
		})),
	};
};
