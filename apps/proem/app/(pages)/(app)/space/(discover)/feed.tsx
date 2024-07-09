"use client";
import { Bookmarks } from "@/app/(pages)/(app)/space/(discover)/add-to-collection-button";
import FeedItem, {
	FeedItemProps,
} from "@/app/(pages)/(app)/space/(discover)/feed-item";
import {
	fetchFeedByInstitution,
	fetchFeedByTopic,
} from "@/app/(pages)/(app)/space/(discover)/fetch-feed";
import { fetchFeedByFeatures } from "@/app/data/fetch-feed";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { FeatureBadge, FeatureCloud } from "@/components/feature-badges";
import { InfinityScrollList } from "@/components/infinity-scroll-list";
import { RankedFeature } from "@proemial/repositories/oa/fingerprinting/features";
import { RankedPaper } from "@proemial/repositories/oa/fingerprinting/rerank";
import { ReactNode } from "react";

// 1-4 is fetched without scrolling
const initialPageSize = 4;
type FeedProps = {
	children: ReactNode;
	debug?: boolean;
	filter: {
		topic?: number;
		features?: RankedFeature[];
		days?: number;
		institution?: string;
	};
	nocache?: boolean;
	bookmarks: Bookmarks;
};

export function Feed({
	children,
	filter,
	debug,
	nocache,
	bookmarks,
}: FeedProps) {
	const { topic, features, days, institution } = filter;
	console.log("Feed", filter);

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
					if (institution) {
						return fetchFeedByInstitution(
							{ id: institution },
							{ offset: ctx.pageParam },
						);
					}
					return fetchFeedByTopic({ field: topic }, { offset: ctx.pageParam });
				}}
				renderHeadline={debug ? (count) => <DebugInfo count={count} /> : null}
				renderRow={(row) => {
					// TODO! why are we casting here?
					const paper = row as RankedPaper;
					const isBookmarked = Boolean(bookmarks[paper.paper.id]);
					return (
						<FeedItem
							paper={paper.paper}
							fingerprint={paper.features}
							isBookmarked={isBookmarked}
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
