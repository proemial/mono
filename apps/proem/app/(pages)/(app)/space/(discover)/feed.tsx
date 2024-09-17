"use client";
import { Bookmarks } from "@/app/(pages)/(app)/space/(discover)/add-to-collection-button";
import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import { FeedResponse } from "@/app/api/feed/route";
import { Theme } from "@/app/theme/color-theme";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { FeatureBadge, FeatureCloud } from "@/components/feature-badges";
import { InfinityScrollList } from "@/components/infinity-scroll-list";
import { ThemeColoredCard } from "@/components/theme-colored-card";
import { getFeedQueryKey } from "@/utils/get-feed-query-key";
import { RankedFeature } from "@proemial/repositories/oa/fingerprinting/features";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

// 1-4 is fetched without scrolling
const initialPageSize = 4;
export type FeedProps = {
	children?: ReactNode;
	filter:
		| {
				// @deprecated
				features: RankedFeature[];
				// @deprecated
				days?: number;
				collectionId?: string;
		  }
		| {
				institution: string;
		  }
		| {
				collectionId: string;
		  };
	bookmarks?: Bookmarks | null;
	header?: ReactNode;
	theme?: Theme;
	readonly?: boolean;
	showThemeColors?: boolean;
};

export function Feed({
	children,
	filter,
	bookmarks,
	header,
	theme,
	readonly,
	showThemeColors = false,
}: FeedProps) {
	const debug = useSearchParams().get("debug");
	const nocache = useSearchParams().get("nocache");
	const days = Number(useSearchParams().get("days")) || undefined;
	const queryKey = getFeedQueryKey(filter);

	const isDefaultSpace =
		"collectionId" in filter && filter.collectionId?.startsWith("user_");

	return (
		<div className="space-y-5 pb-10">
			{children ? <div>{children}</div> : null}
			{header}
			<InfinityScrollList
				queryKey={queryKey}
				queryFn={async (ctx) => {
					const nextOffset = ctx.pageParam;

					if (nextOffset > initialPageSize) {
						trackHandler(analyticsKeys.feed.scroll.fetch, {
							offset: `${nextOffset - initialPageSize}`,
						})();
					}

					const feed = await fetch(
						`/api/feed?${
							"collectionId" in filter
								? `collection_id=${filter.collectionId}`
								: "institution" in filter
									? `institution_id=${filter.institution}`
									: ""
						}&offset=${ctx.pageParam}`,
					);
					// TODO! error handling
					const data = (await feed.json()) as FeedResponse;

					return data;
				}}
				renderHeadline={debug ? (count) => <DebugInfo count={count} /> : null}
				renderRow={(row, i) => {
					const isBookmarked = Boolean(bookmarks?.[row.paper.id]);
					const topics = row.paper.data.topics;
					const field = topics && getFieldFromOpenAlexTopics(topics);

					const item = (
						<FeedItem
							paper={row.paper}
							feedType={row.type}
							fingerprint={row.features}
							customCollectionId={
								"collectionId" in filter ? filter.collectionId : undefined
							}
							isBookmarked={isBookmarked}
							readonly={readonly}
						>
							{debug && (
								<FeatureCloud
									features={row.features}
									sum={row.filterMatchScore}
								/>
							)}
						</FeedItem>
					);

					if (theme && i % 2 === 0) {
						return <ThemeColoredCard theme={theme}>{item}</ThemeColoredCard>;
					}

					if ((showThemeColors || isDefaultSpace) && field?.theme) {
						return (
							<ThemeColoredCard theme={field?.theme}>{item}</ThemeColoredCard>
						);
					}

					return (
						<div className="bg-white hover:shadow p-3.5 rounded-2xl">
							{item}
						</div>
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
				<div>
					<FeatureBadge variant="disabled">skipped</FeatureBadge>
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
