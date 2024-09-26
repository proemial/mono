"use client";
import { Bookmarks } from "@/app/(pages)/(app)/space/(discover)/add-to-collection-button";
import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import { FeedResponse } from "@/app/api/feed/route";
import { Theme } from "@/app/theme/color-theme";
import {
	Branding,
	brandingForInstitution,
} from "@/app/theme/institution-branding";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { FeatureCloud } from "@/components/feature-badges";
import { DebugInfo } from "@/components/features/legend";
import { InfinityScrollList } from "@/components/infinity-scroll-list";
import { ThemeColoredCard } from "@/components/theme-colored-card";
import { getFeedQueryKey } from "@/utils/get-feed-query-key";
import { RankedFeature } from "@proemial/repositories/oa/fingerprinting/features";
import { Button } from "@proemial/shadcn-ui";
import Link from "next/link";
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
	debug?: boolean;
};

export function Feed({
	children,
	filter,
	bookmarks,
	header,
	theme,
	readonly,
	showThemeColors = false,
	debug,
}: FeedProps) {
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
					if ("contentType" in row && row.contentType === "institution") {
						const branding =
							brandingForInstitution(row.institution) ??
							({
								theme: { color: "gold", image: "fingerprint" },
							} satisfies Branding);

						return (
							<Link href={`/discover/${row.institution}`}>
								<ThemeColoredCard theme={branding.theme}>
									<div className="flex flex-col xs:flex-row gap-4 items-center justify-end p-1">
										{"logo" in branding && branding.logo?.url && (
											<div className="flex-1">
												<img
													src={branding.logo.url}
													alt={row.institution}
													className="w-20 h-auto m-auto"
												/>
											</div>
										)}
										<div className="space-y-6 text-center xs:text-right">
											<p className="max-w-xs">
												Are you curious about what research {row.institution} is
												currently publishing?
											</p>
											<Button
												size="pillLg"
												//For some reason the padding is not even as with pullLg
												className="px-5"
											>
												Visit the {row.institution} Space
											</Button>
										</div>
									</div>
								</ThemeColoredCard>
							</Link>
						);
					}

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

					//					if (theme && i % 2 === 0) {
					if (theme) {
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
