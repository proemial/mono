"use client";
import { FeedItemProps } from "@/app/(pages)/(app)/discover/feed-item";
import { FeatureBadge } from "@/components/feature-badges";
import {
	InfinityScollListProps,
	InfinityScrollList,
} from "@/components/infinite-list";
import { ReactNode } from "react";

type FeedProps = Pick<FeedItemProps, "bookmarks"> &
	Pick<InfinityScollListProps, "filter" | "debug" | "nocache"> & {
		children: ReactNode;
		debug?: boolean;
	};

export function Feed({
	children,
	filter,
	debug,
	nocache,
	bookmarks,
}: FeedProps) {
	return (
		<div className="space-y-5 pb-10">
			<div>{children}</div>

			<InfinityScrollList
				filter={filter}
				debug={debug}
				nocache={nocache}
				bookmarks={bookmarks}
				renderSection={debug ? (count) => <DebugInfo count={count} /> : null}
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
			</div>
			<div>
				{Boolean(count) && (
					<div className="mt-1 text-right">{count} matching papers</div>
				)}
			</div>
		</div>
	);
}
