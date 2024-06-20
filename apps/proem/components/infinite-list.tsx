"use client";
import { Icons } from "@proemial/shadcn-ui";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ReactNode, useEffect } from "react";
import { QueryFunction, useInfiniteQuery } from "react-query";

const Loader = () => (
	<div className="w-full h-24 flex justify-center items-center">
		<Icons.loader />
	</div>
);

type QueryReturnType<TRow> = {
	count: number;
	nextOffset: number;
	rows: TRow[];
};

export type InfinityScollListProps<TQueryKey extends string, TRow> = {
	renderHeadline?: ((count?: number) => ReactNode) | null;
	renderRow: (row: TRow) => ReactNode;
	queryKey: TQueryKey;
	queryFn: QueryFunction<QueryReturnType<TRow>, TQueryKey>;
};

export function InfinityScrollList<TQueryKey extends string, TRow>({
	renderHeadline: renderSection,
	renderRow,
	queryKey,
	queryFn,
}: InfinityScollListProps<TQueryKey, TRow>) {
	const {
		status,
		data,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		error,
	} = useInfiniteQuery(queryKey, queryFn, {
		getNextPageParam: (lastGroup) => {
			return lastGroup?.nextOffset;
		},
		refetchOnWindowFocus: false,
	});

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
							const row = allRows[virtualRow.index];

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
