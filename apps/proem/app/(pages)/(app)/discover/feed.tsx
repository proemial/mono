"use client";
import FeedItem, {
	FeedItemProps,
} from "@/app/(pages)/(app)/discover/feed-item";
import { FeatureBadge, FeatureCloud } from "@/components/feature-badges";
import {
	InfinityScollListProps,
	InfinityScrollList,
} from "@/components/infinite-list";
import { ReactNode } from "react";

type FeedProps = Pick<FeedItemProps, "bookmarks"> &
	Pick<InfinityScollListProps, "filter" | "nocache"> & {
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
				queryKey={
					filter.topic
						? `feed_${filter.topic}`
						: `filter_${filter.days}:${filter.features
								?.map((f) => f.id)
								.join("|")}`
				}
				filter={filter}
				nocache={nocache}
				renderHeadline={debug ? (count) => <DebugInfo count={count} /> : null}
				renderRow={(row) => {
					return (
						<FeedItem
							paper={row.paper}
							fingerprint={row.features}
							bookmarks={bookmarks}
						>
							{debug && (
								<FeatureCloud
									features={row.features}
									sum={row.filterMatchScore}
								/>
							)}
						</FeedItem>
					);
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
			</div>
			<div>
				{Boolean(count) && (
					<div className="mt-1 text-right">{count} matching papers</div>
				)}
			</div>
		</div>
	);
}
