"use client";
import { FeedFilter } from "@/app/(pages)/(app)/discover/feed-filter";
import FeedItem from "@/app/(pages)/(app)/discover/feed-item";
import { fetchFeed } from "@/app/(pages)/(app)/discover/fetch-feed";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { OaFields } from "@proemial/models/open-alex-fields";
import { Icons } from "@proemial/shadcn-ui";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useInfiniteQuery } from "react-query";

const Loader = () => (
	<div className="w-full h-24 flex justify-center items-center">
		<Icons.loader />
	</div>
);

export function Feed({ children }: { children: ReactNode }) {
	const searchParams = useSearchParams();
	const topic = searchParams.get("topic") ?? "";
	const filter = searchParams.get("filter") ?? "";

	const fieldId = OaFields.find(
		(c) =>
			c.display_name.toLowerCase() === decodeURI(topic).replaceAll("%2C", ","),
	)?.id;

	const {
		status,
		data,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		error,
	} = useInfiniteQuery(
		fieldId ? `feed_${fieldId}` : `filter_${filter}`,
		(ctx) => fetchFeed({ field: fieldId, filter }, { offset: ctx.pageParam }),
		{
			getNextPageParam: (_lastGroup, groups) => groups.length,
		},
	);

	const allRows = data ? data.pages.flatMap((d) => d.rows) : [];

	const rowVirtualizer = useWindowVirtualizer({
		count: hasNextPage ? allRows.length + 1 : allRows.length,
		estimateSize: () => 160,
		overscan: 5,
	});
	const items = rowVirtualizer.getVirtualItems();

	useEffect(() => {
		const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

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
	}, [
		hasNextPage,
		fetchNextPage,
		allRows.length,
		isFetchingNextPage,
		rowVirtualizer.getVirtualItems(),
	]);

	return (
		<div className="space-y-5 pb-10">
			{children}

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
							const paper = allRows[virtualRow.index];

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
									) : paper ? (
										<FeedItem paper={paper} />
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
