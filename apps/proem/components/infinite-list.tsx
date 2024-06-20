"use client";
import { fetchFeedByTopic } from "@/app/(pages)/(app)/discover/fetch-feed";
import { fetchFeedByFeatures } from "@/app/data/fetch-feed";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { RankedFeature } from "@proemial/repositories/oa/fingerprinting/features";
import { RankedPaper } from "@proemial/repositories/oa/fingerprinting/rerank";
import { Icons } from "@proemial/shadcn-ui";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ReactNode, useEffect } from "react";
import { useInfiniteQuery } from "react-query";

// 1-4 is fetched without scrolling
const initialPageSize = 4;

const Loader = () => (
	<div className="w-full h-24 flex justify-center items-center">
		<Icons.loader />
	</div>
);

export type InfinityScollListProps = {
	filter: { topic?: number; features?: RankedFeature[]; days?: number };
	nocache?: boolean;
	renderHeadline?: ((count?: number) => ReactNode) | null;
	renderRow: (row: RankedPaper) => ReactNode;
};

export function InfinityScrollList({
	filter,
	nocache,
	renderHeadline: renderSection,
	renderRow,
}: InfinityScollListProps) {
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
					nocache,
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

	const allRows = data ? data.pages?.flatMap((d) => d.rows) : [];
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
		<>
			{renderSection?.(count)}

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
										renderRow(row)
									) : (
										<Loader />
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
}
