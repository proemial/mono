"use client";
import FeedItem from "@/app/(pages)/(app)/discover/feed-item";
import { OpenAlexPaper } from "@proemial/papers/oa/models/oa-paper";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ReactNode } from "react";

export function StaticFeed({
	feed,
	children,
}: { feed: OpenAlexPaper[]; children: ReactNode }) {
	const rowVirtualizer = useWindowVirtualizer({
		count: feed.length,
		estimateSize: () => 160,
	});
	const items = rowVirtualizer.getVirtualItems();

	return (
		<div className="space-y-5 pb-10">
			<div className="text-[28px] font-normal pt-6">{children}</div>
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
					{!items.length && <div>No papers found</div>}
					{items.map((virtualRow) => {
						const paper = feed[virtualRow.index];
						if (!paper) {
							return null;
						}

						return (
							<div
								ref={rowVirtualizer.measureElement}
								key={virtualRow.key}
								data-index={virtualRow.index}
								className="py-5"
							>
								<FeedItem paper={paper} />
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
