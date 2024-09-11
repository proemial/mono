"use client";
import { cn } from "@proemial/shadcn-ui";
import {
	QueryFunction,
	useInfiniteQuery,
	useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ReactNode, useEffect } from "react";
import { Throbber } from "./throbber";

type QueryReturnType<TRow> = {
	count: number;
	nextOffset: number;
	rows: TRow[];
};

type InfinityScollListProps<MyTQueryKey extends string[], TRow> = {
	renderHeadline?: ((count?: number) => ReactNode) | null;
	renderRow: (row: TRow, index: number) => ReactNode;
	queryKey: MyTQueryKey;
	queryFn: QueryFunction<QueryReturnType<TRow>, MyTQueryKey, number>;
};

export function InfinityScrollList<MyTQueryKey extends string[], TRow>({
	renderHeadline: renderSection,
	renderRow,
	queryKey,
	queryFn,
}: InfinityScollListProps<MyTQueryKey, TRow>) {
	const {
		status,
		data,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		error,
	} = useSuspenseInfiniteQuery({
		queryKey,
		queryFn,
		initialPageParam: 1, // TODO: change to 0
		getNextPageParam: (lastGroup) => {
			return lastGroup?.nextOffset;
		},
		refetchOnWindowFocus: false,
	});

	const allRows = data
		? data.pages?.filter((d) => !!d).flatMap((d) => d.rows)
		: [];
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

			{status === "error" && error instanceof Error ? (
				<span>Error: {error?.message}</span>
			) : (
				<ScrollItem
					className="space-y-3"
					count={rowVirtualizer.getTotalSize()}
					index={items[0]?.start ?? 0}
				>
					{items.map((virtualRow, i) => {
						const isLoaderRow = virtualRow.index > allRows.length - 1;
						const row = allRows[virtualRow.index];

						return (
							<div
								ref={rowVirtualizer.measureElement}
								key={virtualRow.key}
								data-index={virtualRow.index}
							>
								{isLoaderRow ? (
									hasNextPage ? (
										<Throbber />
									) : null
								) : row ? (
									renderRow(row, i)
								) : (
									<Throbber />
								)}
							</div>
						);
					})}
				</ScrollItem>
			)}
		</>
	);
}

type ScrollItemProps = {
	children: ReactNode;
	className?: string;
	count: number;
	index: number;
};

function ScrollItem({ children, count, index, className }: ScrollItemProps) {
	return (
		<div
			className="w-full relative"
			style={{
				height: count,
			}}
		>
			<div
				className={cn("absolute, top-0 left-0 w-full", className)}
				style={{
					transform: `translateY(${index}px)`,
				}}
			>
				{children}
			</div>
		</div>
	);
}
