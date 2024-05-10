"use client";
import { FeedFilter } from "@/app/(pages)/(app)/discover/feed-filter";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { OaFields } from "@proemial/models/open-alex-fields";
import { useEffect, useRef } from "react";

import FeedItem from "@/app/(pages)/(app)/discover/feed-item";
import { fetchFeed } from "@/app/(pages)/(app)/discover/fetch-feed";
import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Loading01 } from "@untitled-ui/icons-react";
import { useInfiniteQuery } from "react-query";

export type FeedProps = {
	fieldId?: number;
};

export function Feed({ fieldId }: FeedProps) {
	const {
		status,
		data,
		error,
		isFetching,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery(
		`feed_${fieldId}`,
		(ctx) =>
			fetchFeed({ field: fieldId }, { limit: 10, offset: ctx.pageParam }),
		{
			getNextPageParam: (_lastGroup, groups) => groups.length,
		},
	);

	const allRows = data ? data.pages.flatMap((d) => d.rows) : [];

	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useWindowVirtualizer({
		count: hasNextPage ? allRows.length + 1 : allRows.length,
		estimateSize: () => 112,
		overscan: 5,
	});

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
		<div className="space-y-10 pb-10">
			<HorisontalScrollArea>
				<FeedFilter
					items={[
						"all",
						...OaFields.map((field) => field.display_name.toLowerCase()),
					]}
					rootPath="/discover"
				/>
			</HorisontalScrollArea>

			{status === "loading" ? (
				<div className="w-full h-24 flex justify-center items-center">
					<Loading01 />
				</div>
			) : status === "error" ? (
				<span>Error:</span>
			) : (
				<div
					className="w-full relative space-y-10"
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => {
						const isLoaderRow = virtualRow.index > allRows.length - 1;
						const paper = allRows[virtualRow.index];

						if (!paper) {
							return null;
						}

						return (
							<div
								ref={rowVirtualizer.measureElement}
								key={virtualRow.index}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: `${virtualRow.size}px`,
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								{isLoaderRow ? (
									hasNextPage ? (
										"Loading more..."
									) : (
										"Nothing more to load"
									)
								) : (
									<FeedItem
										id={paper.id}
										key={paper.id}
										paper={paper}
										date={paper.data.publication_date}
										fields={
											paper.data.topics?.map((topic) => ({
												id: topic.field.id,
												score: topic.score,
											})) ?? []
										}
										tags={
											paper.data.topics
												?.map(
													(topic) =>
														oaTopicsTranslationMap[topic.id]?.["short-name"],
												)
												.filter(Boolean) as string[]
										}
									/>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
