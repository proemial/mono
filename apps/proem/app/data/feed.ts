import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { fetchAndRerankPaperIds } from "@/app/data/fetch-by-features";
import { FetchFeedParams } from "@/app/data/fetch-feed";
import { summarise } from "@/app/prompts/summarise-title";
import { Paper } from "@proemial/data/paper";
import { Redis } from "@proemial/redis/redis";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";

const DEFAULT_LIMIT = 10;
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
	| 1 = 0.3;

// TODO! move to data when all dependencies are moved out of apps/proem
export namespace Feed {
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
		const rankedPaperOffset = offset;

		const mostPopularPapers = await Paper.getByPopularity({
			limit: popularPaperLimit,
			offset: popularPaperOffset,
		});

		const { meta, rankedIds } = await fetchAndRerankPaperIds(
			params,
			{
				limit: rankedPaperLimit,
				offset: 1,
			},
			nocache,
		);
		const feedIds = injectItems({
			rankedItems: rankedIds.map((rankedId) => rankedId?.id).filter(Boolean),
			injectedItems: mostPopularPapers.map((paper) => paper.paperId),
		});

		if (!feedIds.length) {
			throw new Error("No papers found.");
		}

		const cachedPapers = await Redis.papers.getAll(feedIds);

		const cachedPapersIds = cachedPapers
			.map((cachedPaper) =>
				// we only consider a cachedPaper valid if it has a generated title
				cachedPaper?.generated?.title ? cachedPaper?.id : null,
			)
			.filter(Boolean);

		const cacheMisses = feedIds.filter((id) => !cachedPapersIds.includes(id));

		if (cacheMisses.length === 0) {
			return {
				count: meta.count,
				rows: feedIds
					.map((id) => {
						const paper = cachedPapers.find(
							(cachedPaper) => cachedPaper?.id === id,
						);
						if (!paper) {
							return;
						}

						return {
							paper,
						};
					})
					.filter((item) => item !== undefined),
				nextOffset,
			};
		}

		const enhanced = [] as OpenAlexPaper[];
		const feedItems = await Promise.all(
			feedIds.map(async (feedId) => {
				const currentPaper = await fetchPaper(feedId);
				if (!currentPaper) {
					console.log("Paper not found", feedId);
					return;
				}
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
						id: feedId,
						paper: { ...currentPaper, generated },
					};
				}
				return {
					id: feedId,
					paper: currentPaper,
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
