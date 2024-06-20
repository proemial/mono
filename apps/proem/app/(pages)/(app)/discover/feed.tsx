"use client";
import FeedItem, {
	FeedItemProps,
} from "@/app/(pages)/(app)/discover/feed-item";
import { fetchFeedByTopic } from "@/app/(pages)/(app)/discover/fetch-feed";
import { fetchFeedByFeatures } from "@/app/data/fetch-feed";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { FeatureBadge, FeatureCloud } from "@/components/feature-badges";
import { InfinityScrollList } from "@/components/infinite-list";
import { RankedFeature } from "@proemial/repositories/oa/fingerprinting/features";
import { RankedPaper } from "@proemial/repositories/oa/fingerprinting/rerank";
import { ReactNode } from "react";

// 1-4 is fetched without scrolling
const initialPageSize = 4;
type FeedProps = Pick<FeedItemProps, "bookmarks"> & {
	children: ReactNode;
	debug?: boolean;
	filter: { topic?: number; features?: RankedFeature[]; days?: number };
	nocache?: boolean;
};

export function Feed({
	children,
	filter,
	debug,
	nocache,
	bookmarks,
}: FeedProps) {
	const { topic, features, days } = filter;
	return (
		<div className="space-y-5 pb-10">
			<div>{children}</div>

			<InfinityScrollList
				queryKey={
					filter.topic
						? `feed_${filter.topic}`
						: `filter_${filter.days}:${filter.features
								?.map((f) => f.id)
								.join("|")}`
				}
				queryFn={(ctx) => {
					const nextOffset = ctx.pageParam;
					if (nextOffset > initialPageSize) {
						trackHandler(analyticsKeys.feed.scroll.fetch, {
							offset: `${nextOffset - initialPageSize}`,
						})();
					}

					if (features?.length) {
						return fetchFeedByFeatures(
							{ features, days },
							{ offset: ctx.pageParam },
							nocache,
						);
					}
					return fetchFeedByTopic({ field: topic }, { offset: ctx.pageParam });
				}}
				renderHeadline={debug ? (count) => <DebugInfo count={count} /> : null}
				renderRow={(row) => {
					// TODO! why are we casting here?
					const paper = row as RankedPaper;
					return (
						<FeedItem
							paper={paper.paper}
							fingerprint={paper.features}
							bookmarks={bookmarks}
						>
							{debug && (
								<FeatureCloud
									features={paper.features}
									sum={paper.filterMatchScore}
								/>
							)}
						</FeedItem>
					);
				}}
			/>
		</div>
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
