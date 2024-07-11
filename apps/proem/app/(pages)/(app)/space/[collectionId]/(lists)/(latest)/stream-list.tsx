"use client";

import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { fetchFeedByFeaturesWithPosts } from "@/app/data/fetch-feed";
import { InfinityScrollList } from "@/components/infinity-scroll-list";

type FetchFeedByFeaturesProps = Required<
	Parameters<typeof fetchFeedByFeaturesWithPosts>[0]
>;
export type StreamListProps = FetchFeedByFeaturesProps & {
	collectionId: string;
	bookmarks?: string[];
	readonly: boolean;
};

export function StreamList({
	collectionId,
	bookmarks,
	features,
	days,
	readonly,
}: StreamListProps) {
	return (
		<InfinityScrollList
			queryKey={`space_stream_${collectionId}`}
			queryFn={(ctx) => {
				const nextOffset = ctx.pageParam;
				//TODO! Add tracking
				// if (nextOffset > initialPageSize) {
				// 	trackHandler(analyticsKeys.feed.scroll.fetch, {
				// 		offset: `${nextOffset - initialPageSize}`,
				// 	})();
				// }

				return fetchFeedByFeaturesWithPosts(
					{ features, days },
					{ offset: ctx.pageParam },
					undefined,
					collectionId,
				);
				// return fetchFeedByTopic({ field: topic }, { offset: ctx.pageParam });
			}}
			// renderHeadline={debug ? (count) => <DebugInfo count={count} /> : null}
			renderRow={(row) => {
				return (
					<FeedItem
						paper={row.paper}
						fingerprint={row.features}
						customCollectionId={collectionId}
						isBookmarked={Boolean(
							bookmarks?.some((bookmarkId) => row.paper.id === bookmarkId),
						)}
						readonly={readonly}
					>
						{/* TODO! add debug mode */}
						{/* {debug && (
							<FeatureCloud
								features={paper.features}
								sum={paper.filterMatchScore}
							/>
						)} */}
					</FeedItem>
				);
			}}
		/>
	);
}
