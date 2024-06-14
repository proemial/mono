"use client";
import FeedItem from "@/app/(pages)/(app)/discover/feed-item";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { Icons } from "@proemial/shadcn-ui";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ReactNode, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { fetchFeedByTopic } from "@/app/(pages)/(app)/discover/fetch-feed";
import { RankedFeature } from "@proemial/repositories/oa/fingerprinting/features";
import { FeatureBadge, FeatureCloud } from "@/components/feature-badges";
import { fetchFeedByFeatures } from "@/app/data/fetch-feed";
import { RankedPaper } from "@/app/data/fetch-by-features";

// 1-4 is fetched without scrolling
const initialPageSize = 4;

const Loader = () => (
	<div className="w-full h-24 flex justify-center items-center">
		<Icons.loader />
	</div>
);

type Props = {
	children: ReactNode;
	filter: { topic?: number; features?: RankedFeature[]; days?: number };
	debug?: boolean;
};

export function Feed({ children, filter, debug }: Props) {
	const { topic, features, days } = filter;

	const {
		status,
		data,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		error,
	} = useInfiniteQuery(
		topic
			? `feed_${topic}`
			: `filter_${days}:${features?.map((f) => f.id).join("|")}`,
		(ctx) => {
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
				);
			}
			return fetchFeedByTopic({ field: topic }, { offset: ctx.pageParam });
		},
		{
			getNextPageParam: (lastGroup) => {
				return lastGroup?.nextOffset;
			},
			refetchOnWindowFocus: false,
		},
	);

	const allRows = data ? data.pages.flatMap((d) => d.rows) : [];
	const count = data?.pages.at(0)?.count;

	const rowVirtualizer = useWindowVirtualizer({
		count: hasNextPage ? allRows.length + 1 : allRows.length,
		estimateSize: () => 160,
		overscan: 5,
	});
	const items = rowVirtualizer.getVirtualItems();

	useEffect(() => {
		const [lastItem] = [...items].reverse();

		if (!lastItem) {
			return;
		}

		if (
			lastItem.index >= allRows.length - 1 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage();
		}
	}, [hasNextPage, fetchNextPage, allRows.length, isFetchingNextPage, items]);

	return (
		<div className="space-y-5 pb-10">
			<div>{children}</div>
			<div>{debug && <DebugInfo count={count} />}</div>

			{status === "loading" ? (
				<Loader />
			) : status === "error" && error instanceof Error ? (
				<span>Error: {error?.message}</span>
			) : (
				<div
					className="w-full relative"
					style={{
						height: rowVirtualizer.getTotalSize(),
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							transform: `translateY(${items[0]?.start ?? 0}px)`,
						}}
					>
						{items.map((virtualRow) => {
							const isLoaderRow = virtualRow.index > allRows.length - 1;
							const row = allRows[virtualRow.index] as RankedPaper;

							return (
								<div
									ref={rowVirtualizer.measureElement}
									key={virtualRow.key}
									data-index={virtualRow.index}
									className="py-5"
								>
									{isLoaderRow ? (
										hasNextPage ? (
											<Loader />
										) : null
									) : row ? (
										<FeedItem paper={row.paper} fingerprint={row.features}>
											{debug && (
												<FeatureCloud
													features={row.features}
													sum={row.filterMatchScore}
												/>
											)}
										</FeedItem>
									) : (
										<Loader />
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}
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
				{!!count && (
					<div className="mt-1 text-right">{count} matching papers</div>
				)}
			</div>
		</div>
	);
}
