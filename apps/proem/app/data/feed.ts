import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { fetchAndRerankPaperIds } from "@/app/data/fetch-by-features";
import { FetchFeedParams } from "@/app/data/fetch-feed";
import { summarise } from "@/app/prompts/summarise-title";
import { Paper } from "@proemial/data/paper";
import { Redis } from "@proemial/redis/redis";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { z } from "zod";

const DEFAULT_LIMIT = 5;
const POPULAR_PAPERS_PERCENTAGE:
	| 0.1
	| 0.2
	| 0.3
	| 0.4
	| 0.5
	| 0.6
	| 0.7
	| 0.8
	| 0.9
	| 1 = 0.4;

// TODO! move to data when all dependencies are moved out of apps/proem
export namespace Feed {
	export const Row = z.object({
		type: z.enum(["organic", "popularity-boost"]),
	});

	// TODO! remove hardcoded reference to OpenAlexPaper
	export type Row = z.infer<typeof Row> & { paper: OpenAlexPaper };

	const injectItems = <
		TRankedItems extends any[],
		TInjectedItems extends any[],
	>({
		rankedItems,
		injectedItems,
	}: { rankedItems: TRankedItems; injectedItems: TInjectedItems }) => {
		const items = [...rankedItems];

		for (const item of injectedItems) {
			items.splice(Math.floor(Math.random() * items.length), 0, item);
		}

		return items;
	};

	// TODO!: handle duplicates
	// TODO!: add hardcoded set of items to include
	export const fromFeatures = async (
		params: FetchFeedParams[0],
		options: FetchFeedParams[1],
		nocache?: boolean,
		injectPopularPapers?: boolean,
	) => {
		const limit = options.limit ?? DEFAULT_LIMIT;
		const offset = options.offset ?? 1;
		const nextOffset = offset + 1;
		const popularPaperLimit = injectPopularPapers
			? limit * POPULAR_PAPERS_PERCENTAGE
			: 0;
		const popularPaperOffset = offset * popularPaperLimit - popularPaperLimit;
		const rankedPaperLimit = limit - popularPaperLimit;

		const mostPopularPapers = await Paper.getByPopularity({
			limit: popularPaperLimit,
			offset: popularPaperOffset,
		});

		const {
			meta,
			rankedIds,
			papers: rankedPapers,
		} = await fetchAndRerankPaperIds(
			params,
			{
				limit: rankedPaperLimit,
				offset: offset,
			},
			nocache,
		);
		const feedIds = injectItems({
			rankedItems: rankedIds
				.map((rankedId) => ({ id: rankedId?.id, type: "organic" }))
				.filter((paper) => !!paper.id),
			injectedItems: mostPopularPapers.map((paper) => ({
				id: paper.paperId,
				type: "popularity-boost",
			})),
		});

		if (!feedIds.length) {
			throw new Error("No papers found.");
		}

		const cachedPapers = await Redis.papers.getAll(
			feedIds.map((paper) => paper.id),
		);

		const cachedPapersIds = cachedPapers
			.map((cachedPaper) =>
				// we only consider a cachedPaper valid if it has a generated title
				cachedPaper?.generated?.title ? cachedPaper?.id : null,
			)
			.filter(Boolean);

		const cacheMisses = feedIds.filter(
			(paper) => !cachedPapersIds.includes(paper.id),
		);

		if (cacheMisses.length === 0) {
			return {
				count: meta.count,
				rows: feedIds
					.map(({ id, type }) => {
						const paper = cachedPapers.find(
							(cachedPaper) => cachedPaper?.id === id,
						);
						if (!paper) {
							return;
						}
						const asRankedPaper = rankedPapers.find(
							(rankedPaper) => rankedPaper.id === id,
						);

						return {
							...asRankedPaper,
							type,
							paper,
						};
					})
					.filter((item) => item !== undefined),
				nextOffset,
			};
		}

		const enhanced = [] as OpenAlexPaper[];
		const feedItems = await Promise.all(
			feedIds.map(async ({ id, type }) => {
				const currentPaper = await fetchPaper(id);
				if (!currentPaper) {
					console.log("Paper not found", id);
					return;
				}
				const asRankedPaper = rankedPapers.find(
					(rankedPaper) => rankedPaper.id === id,
				);
				const paperTitle = currentPaper?.data?.title;
				const abstract = currentPaper?.data?.abstract;
				const generatedTitle = currentPaper?.generated?.title;

				if (!generatedTitle && paperTitle && abstract) {
					console.log("Enhancing paper", currentPaper.id);
					const title = (await summarise(paperTitle, abstract)) as string;
					const generated = currentPaper.generated
						? { ...currentPaper.generated, title }
						: { title };

					enhanced.push({ ...currentPaper, generated });

					return {
						...asRankedPaper,
						id,
						paper: { ...currentPaper, generated },
						type,
					};
				}
				return {
					...asRankedPaper,
					id,
					paper: currentPaper,
					type,
				};
			}),
		);

		await Redis.papers.upsertAll(enhanced);
		return {
			count: meta.count,
			rows: feedItems.filter((item) => item !== undefined),
			nextOffset,
		};
	};
}
