"use client";

import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { fetchFeedByFeaturesWithPosts } from "@/app/data/fetch-feed";
import { InfinityScrollList } from "@/components/infinity-scroll-list";
import { StreamDebugParams } from "../../params";
import { FeatureBadge, FeatureCloud } from "@/components/feature-badges";

type FetchFeedByFeaturesProps = Required<
	Parameters<typeof fetchFeedByFeaturesWithPosts>[0]
>;
export type StreamListProps = FetchFeedByFeaturesProps & {
	collectionId: string;
	bookmarks?: string[];
	readonly: boolean;
	debugParams?: StreamDebugParams;
};

export function StreamList({
	collectionId,
	bookmarks,
	features,
	days,
	readonly,
	debugParams,
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
			renderHeadline={
				debugParams?.debug ? (count) => <DebugInfo count={count} /> : null
			}
			renderRow={(row) => {
				return (
					<div className="py-5">
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
							{debugParams?.debug && (
								<FeatureCloud
									features={row.features}
									sum={row.filterMatchScore}
								/>
							)}
						</FeedItem>
					</div>
				);
			}}
		/>
	);
}

function DebugInfo({ count }: { count?: number }) {
	return (
		<div className="flex justify-between italic text-xs text-gray-400">
			<div className="flex">
				<div>
					<FeatureBadge>sum</FeatureBadge>
				</div>
				<div>
					<FeatureBadge variant="topic">topic</FeatureBadge>
				</div>
				<div>
					<FeatureBadge variant="keyword">keyword</FeatureBadge>
				</div>
				<div>
					<FeatureBadge variant="concept">concept</FeatureBadge>
				</div>
			</div>
			<div>
				{Boolean(count) && (
					<div className="mt-1 text-right">{count} matching papers</div>
				)}
			</div>
		</div>
	);
}
