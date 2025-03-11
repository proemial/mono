import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { fetchFeedByInstitutionWithPostsAndReaders } from "@/app/(pages)/(app)/space/(discover)/fetch-feed";
import {
	fingerprintCacheTag,
	getBookmarkedPapersCacheTag,
} from "@/app/constants";
import {
	FEED_DEFAULT_DAYS,
	fetchAndRerankPaperIds,
} from "@/app/data/fetch-by-features";
import {
	FetchFeedParams,
	fetchFeedByFeaturesWithPostsAndReaders,
} from "@/app/data/fetch-feed";
import { Fingerprint } from "@/app/data/fingerprint";
import { Post } from "@/app/data/post";
import { summariseTitle } from "@proemial/adapters/llm/prompts/microtitle";
import { feedSettings } from "@/feature-flags/feed-settings";
import { PaperReadsService } from "@/services/paper-reads-service";
import { Paper } from "@proemial/data/paper";
import { Redis } from "@proemial/adapters/redis";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { unstable_cache } from "next/cache";
import { z } from "zod";
import { iterateStaticFeed } from "./iterate-static-feed";
import { PaginationOptions, PaginationResult, mergeFeed } from "./merge-feed";

const DEFAULT_LIMIT = 5; // TODO! up to 10
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

export const defaultFeedFilter = {
	features: [],
	days: FEED_DEFAULT_DAYS,
	titles: undefined,
};

export const fetchPaperWithPostsAndReaders = async ({
	paperId,
	spaceId,
	organisationId,
	userId,
}: {
	paperId: string;
	spaceId?: string;
	organisationId?: string;
	userId?: string;
}) => {
	const [posts, readers] = await Promise.all([
		Post.getPostsWithCommentsAndAuthors({
			spaceId,
			paperId,
			organisationId,
			userId,
		}),
		// TODO! move to new module structure
		PaperReadsService.getReaders(paperId),
	]);
	return {
		paperId,
		posts,
		readers,
	};
};

// TODO! move to data when all dependencies are moved out of apps/proem
export module Feed {
	export const Row = z.object({
		// Recommendation reason
		type: z.enum(["organic", "popularity-boost"]),
		id: z.string(),
	});

	export type Row =
		| (z.infer<typeof Row> & {
				contentType: "paper";
				// TODO! remove hardcoded reference to OpenAlexPaper
				paper: OpenAlexPaper;
		  })
		| {
				contentType: "institution";
				institution: {
					id: string;
				};
		  };

	export const injectItems = <
		TRankedItems extends { id: string }[],
		TInjectedItems extends { id: string }[],
	>({
		rankedItems,
		injectedItems,
	}: { rankedItems: TRankedItems; injectedItems: TInjectedItems }) => {
		return [...rankedItems, ...injectedItems].sort((a, b) =>
			a.id.localeCompare(b.id),
		);
	};

	export const byFeatures = async (
		params: FetchFeedParams[0],
		options: PaginationOptions,
	) => {
		return Feed.fromFeatures(params, options);
	};

	export const byPopularity = async (options: PaginationOptions) => {
		const mostPopularPapers = await Paper.getByPopularity({
			limit: 3,
			offset: 2, // offset in items
		});

		console.log(mostPopularPapers);

		return {
			count: 0,
			rows: [],
			nextOffset: 1,
		};
	};

	export const byStatic = async (options: PaginationOptions) => {
		const staticItems = [
			"Microsoft",
			"Apple",
			"Amazon",
			"Nike",
			"Tesla",
			"Walt Disney",
			"Zeiss",
			"Nvidia",
		].map((institution, index) => ({
			id: `${index + 1}`,
			contentType: "institution" as const,
			institution: institution,
		}));

		return iterateStaticFeed(staticItems)({
			limit: options.limit,
			// TODO! shame: as we haven't aligned offset
			offset: (options.offset ?? 1) - 1,
		});
	};

	const prepareFeed = async <
		TFeed extends PaginationResult<{ id: string; paper?: { id: string } }>,
	>({
		feed,
		collectionId,
		userId,
		organisationId,
	}: {
		feed: TFeed;
		collectionId?: string;
		userId?: string;
		organisationId?: string;
	}) => {
		if (!feed) {
			return null;
		}

		const paperIds = feed.rows
			.map((row) => ("paper" in row ? row?.paper?.id : null))
			.filter((id) => id !== null && id !== undefined);

		// TODO! move down?
		const papersWithPostsAndReaders = await Promise.all(
			paperIds.map((paperId) =>
				fetchPaperWithPostsAndReaders({
					paperId,
					spaceId: collectionId,
					organisationId,
					userId,
				}),
			),
		);
		const feedWithPostsAndReaders = {
			...feed,
			rows: feed.rows.map((row) => {
				if ("contentType" in row && row.contentType === "institution") {
					return row;
				}

				return {
					...row,
					paper: {
						...row.paper,
						posts:
							papersWithPostsAndReaders.find(
								(paper) => paper.paperId === row.paper?.id,
							)?.posts ?? [],
						readers:
							papersWithPostsAndReaders.find(
								(paper) => paper.paperId === row.paper?.id,
							)?.readers ?? [],
					},
				};
			}),
		};
		return feedWithPostsAndReaders;
	};

	export const fromPublic = async (options: FetchFeedParams[1]) => {
		return fetchFeedByFeaturesWithPostsAndReaders(
			{
				features: defaultFeedFilter.features,
				days: defaultFeedFilter.days,
			},
			options,
		);
		// const settings = await feedSettings();
		// if (!settings.showInstitutions) {
		// 	return fetchFeedByFeaturesWithPostsAndReaders(
		// 		{
		// 			features: defaultFeedFilter.features,
		// 			days: defaultFeedFilter.days,
		// 		},
		// 		options,
		// 	);
		// }
		// const feed = await mergeFeed(
		// 	[
		// 		{
		// 			fetch: (options) =>
		// 				Feed.byFeatures(
		// 					{
		// 						features: defaultFeedFilter.features,
		// 						days: defaultFeedFilter.days,
		// 					},
		// 					options,
		// 				),
		// 			percentage: 0.9,
		// 		},
		// 		{
		// 			fetch: (options) => Feed.byStatic(options),
		// 			percentage: 0.1,
		// 		},
		// 		// {
		// 		// 	fetch: Feed.byPopularity,
		// 		// 	percentage: 0.3,
		// 		// },
		// 	],
		// 	options,
		// );
		// console.log({ feed });
		// if (!feed) {
		// 	return null;
		// }

		// return prepareFeed({
		// 	feed,
		// 	collectionId: undefined,
		// 	userId: undefined,
		// 	organisationId: undefined,
		// });
	};

	export const fromInstitution = async (
		institutionId: string,
		options: FetchFeedParams[1],
	) => {
		// TODO!: refactor
		return fetchFeedByInstitutionWithPostsAndReaders(
			{ id: institutionId },
			options,
			undefined,
		);
	};

	export const fromCollection = async (
		collectionId: string,
		options: FetchFeedParams[1],
		userId?: string,
		organisationId?: string,
	) => {
		const isDefaultSpace = collectionId.startsWith("user_");
		// We only inject popular papers in users default space
		const injectPopularPapersInFeed = isDefaultSpace;

		const fingerprints = await unstable_cache(
			async () => await Fingerprint.fromCollection(collectionId),
			["fingerprint", collectionId],
			{
				revalidate: false,
				tags: [fingerprintCacheTag(collectionId)],
			},
		)();

		const { filter: features } = getFeatureFilter(fingerprints);

		const settings = await feedSettings();
		// const feed = settings.showInstitutions
		// 	? await mergeFeed(
		// 			[
		// 				{
		// 					fetch: Feed.byStatic,
		// 					percentage: 0.1,
		// 				},
		// 				{
		// 					fetch: (options) =>
		// 						Feed.byFeatures({ features, days: FEED_DEFAULT_DAYS }, options),
		// 					percentage: 0.9,
		// 				},
		// 				// {
		// 				// 	fetch: Feed.byPopularity,
		// 				// 	percentage: 0.3,
		// 				// },
		// 			],
		// 			options,
		// 		)
		// 	: await Feed.fromFeatures(
		// 			{ features, days: FEED_DEFAULT_DAYS },
		// 			options,
		// 			injectPopularPapersInFeed,
		// 			collectionId,
		// 		);

		const feed = await Feed.fromFeatures(
			{ features, days: FEED_DEFAULT_DAYS },
			options,
			injectPopularPapersInFeed,
			collectionId,
		);

		if (!feed) {
			return null;
		}

		const paperIds = feed.rows
			.map((row) => ("paper" in row ? row.paper.id : null))
			.filter((id) => id !== null);

		const papersWithPostsAndReaders = await Promise.all(
			paperIds.map((paperId) =>
				fetchPaperWithPostsAndReaders({
					paperId,
					spaceId: collectionId,
					organisationId,
					userId,
				}),
			),
		);
		const feedWithPostsAndReaders = {
			...feed,
			rows: feed.rows.map((row) => {
				// if ("contentType" in row && row.contentType === "institution") {
				// 	return row;
				// }

				return {
					...row,
					paper: {
						...row.paper,
						posts:
							papersWithPostsAndReaders.find(
								(paper) =>
									paper.paperId === ("paper" in row ? row.paper.id : null),
							)?.posts ?? [],
						readers:
							papersWithPostsAndReaders.find(
								(paper) =>
									paper.paperId === ("paper" in row ? row.paper.id : null),
							)?.readers ?? [],
					},
				};
			}),
		};
		return feedWithPostsAndReaders;
	};

	/**
	 *  TODO: split up in Feed.byPopularity and Feed.byFeatures instead
	 */
	export const fromFeatures = async (
		params: FetchFeedParams[0],
		options: FetchFeedParams[1],
		injectPopularPapers?: boolean,
		collectionId?: string,
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
			collectionId,
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
			return null;
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
							id: id,
							contentType: "paper" as const,
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
					// console.log("Enhancing paper", currentPaper.id);
					const title = (await summariseTitle(
						paperTitle,
						abstract,
						"spaces",
					)) as string;
					const generated = currentPaper.generated
						? { ...currentPaper.generated, title }
						: { title };

					enhanced.push({ ...currentPaper, generated });

					return {
						...asRankedPaper,
						id,
						paper: { ...currentPaper, generated },
						contentType: "paper" as const,
						type,
					};
				}
				return {
					...asRankedPaper,
					id,
					paper: currentPaper,
					contentType: "paper" as const,
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
