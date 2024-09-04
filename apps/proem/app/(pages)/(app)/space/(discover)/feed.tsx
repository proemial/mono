"use client";
import { Bookmarks } from "@/app/(pages)/(app)/space/(discover)/add-to-collection-button";
import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import {
	fetchFeedByInstitutionWithPosts,
	fetchFeedByTopicWithPosts,
} from "@/app/(pages)/(app)/space/(discover)/fetch-feed";
import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import { fetchFeedByFeaturesWithPosts } from "@/app/data/fetch-feed";
import { Theme } from "@/app/theme/color-theme";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { FeatureBadge, FeatureCloud } from "@/components/feature-badges";
import { InfinityScrollList } from "@/components/infinity-scroll-list";
import { ThemeColoredCard } from "@/components/theme-colored-card";
import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { RankedFeature } from "@proemial/repositories/oa/fingerprinting/features";
import { RankedPaper } from "@proemial/repositories/oa/fingerprinting/rerank";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

// 1-4 is fetched without scrolling
const initialPageSize = 4;
type FeedProps = {
	children?: ReactNode;
	filter:
		| {
				features: RankedFeature[];
				days?: number;
				collectionId?: string;
		  }
		| {
				institution: string;
		  };
	nocache?: boolean;
	bookmarks?: Bookmarks | null;
	header?: ReactNode;
	theme?: Theme;
	readonly?: boolean;
	showThemeColors?: boolean;
};

export function Feed({
	children,
	filter,
	nocache,
	bookmarks,
	header,
	theme,
	readonly,
	showThemeColors = false,
}: FeedProps) {
	const debug = useSearchParams().get("debug");
	const queryKey =
		"institution" in filter
			? `feed_${filter.institution}`
			: "collectionId" in filter
				? `space_stream_${filter.collectionId}`
				: `filter_${filter.days}:${filter.features
						?.map((f) => f.id)
						.join("|")}`;

	const isDefaultSpace =
		"collectionId" in filter && filter.collectionId?.startsWith("user_");
	return (
		<div className="space-y-5 pb-10">
			{children ? <div>{children}</div> : null}
			{header}
			<InfinityScrollList
				queryKey={[queryKey]}
				queryFn={(ctx) => {
					const nextOffset = ctx.pageParam;

					if (nextOffset > initialPageSize) {
						trackHandler(analyticsKeys.feed.scroll.fetch, {
							offset: `${nextOffset - initialPageSize}`,
						})();
					}

					if ("features" in filter && filter.features?.length) {
						return fetchFeedByFeaturesWithPosts(
							{ features: filter.features, days: filter.days },
							{ offset: ctx.pageParam },
							nocache,
							filter.collectionId,
						);
					}

					if ("institution" in filter) {
						return fetchFeedByInstitutionWithPosts(
							{ id: filter.institution },
							{ offset: ctx.pageParam },
							undefined,
						);
					}

					return fetchFeedByTopicWithPosts(
						{},
						{ offset: ctx.pageParam },
						undefined,
					);
				}}
				renderHeadline={debug ? (count) => <DebugInfo count={count} /> : null}
				renderRow={(row, i) => {
					const paper = row as RankedPaper & {
						paper: RankedPaper["paper"] & {
							posts: PostWithCommentsAndAuthor[];
						};
					};
					const isBookmarked = Boolean(bookmarks?.[paper.paper.id]);
					const topics = row.paper.data.topics;
					const field = topics && getFieldFromOpenAlexTopics(topics);

					const item = (
						<FeedItem
							paper={paper.paper}
							fingerprint={paper.features}
							customCollectionId={
								"collectionId" in filter ? filter.collectionId : undefined
							}
							isBookmarked={isBookmarked}
							readonly={readonly}
						>
							{debug && (
								<FeatureCloud
									features={paper.features}
									sum={paper.filterMatchScore}
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

					return <div className="my-3">{item}</div>;
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
