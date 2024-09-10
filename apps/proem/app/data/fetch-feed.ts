"use server";
import { Feed } from "@/app/data/feed";
import { PaperReadsService } from "@/services/paper-reads-service";
import { PostService } from "@/services/post-service";
import { fetchAndRerankPaperIds } from "./fetch-by-features";

export type FetchFeedParams = Required<
	Parameters<typeof fetchAndRerankPaperIds>
>;

export const fetchFeedByFeaturesWithPostsAndReaders = async (
	params: FetchFeedParams[0],
	options: FetchFeedParams[1],
	nocache: boolean | undefined,
	spaceId: string | undefined,
) => {
	// We only inject popular papers in users default space
	const injectPopularPapersInFeed = !spaceId?.includes("col_");
	const feed = await Feed.fromFeatures(
		params,
		options,
		nocache,
		injectPopularPapersInFeed,
	);
	const paperIds = feed.rows.map(({ paper }) => paper?.id);

	const papersWithPostsAndReaders = await Promise.all(
		paperIds.map((paperId) => fetchPaperWithPostsAndReaders(paperId, spaceId)),
	);
	const feedWithPostsAndReaders = {
		...feed,
		rows: feed.rows.map((row) => ({
			...row,
			paper: {
				...row.paper,
				posts:
					papersWithPostsAndReaders.find(
						(paper) => paper.paperId === row.paper.id,
					)?.posts ?? [],
				readers:
					papersWithPostsAndReaders.find(
						(paper) => paper.paperId === row.paper.id,
					)?.readers ?? [],
			},
		})),
	};
	return feedWithPostsAndReaders;
};

export const fetchPaperWithPostsAndReaders = async (
	paperId: string,
	spaceId: string | undefined,
) => {
	const [posts, readers] = await Promise.all([
		PostService.getPostsWithCommentsAndAuthors(spaceId, paperId),
		PaperReadsService.getReaders(paperId),
	]);
	return {
		paperId,
		posts,
		readers,
	};
};
