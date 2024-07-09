"use client";

import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { fetchFeedByFeatures } from "@/app/data/fetch-feed";
import { InfinityScrollList } from "@/components/infinity-scroll-list";

type FetchFeedByFeaturesProps = Required<
	Parameters<typeof fetchFeedByFeatures>[0]
>;
export type StreamListProps = FetchFeedByFeaturesProps & {
	id: string;
	bookmarks?: string[];
	readonly: boolean;
};

export function StreamList({
	id,
	bookmarks,
	features,
	days,
	readonly,
}: StreamListProps) {
	return (
		<InfinityScrollList
			queryKey={`space_stream_${id}`}
			queryFn={(ctx) => {
				const nextOffset = ctx.pageParam;
				//TODO! Add tracking
				// if (nextOffset > initialPageSize) {
				// 	trackHandler(analyticsKeys.feed.scroll.fetch, {
				// 		offset: `${nextOffset - initialPageSize}`,
				// 	})();
				// }

				return fetchFeedByFeatures(
					{ features, days },
					{ offset: ctx.pageParam },
					// nocache,
				);
				// return fetchFeedByTopic({ field: topic }, { offset: ctx.pageParam });
			}}
			// renderHeadline={debug ? (count) => <DebugInfo count={count} /> : null}
			renderRow={(row) => {
				return (
					<FeedItem
						paper={row.paper}
						fingerprint={row.features}
						customCollectionId={id}
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
