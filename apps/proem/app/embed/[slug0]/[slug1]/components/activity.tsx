"use client";
import { EngagementIndicator } from "@/components/engagement-indicator";
import { EmbedableLink } from "./link";
import { FeedPaper } from "./card";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { activityAction } from "./activity-action";

export function PaperActivity({
	paper,
	customCollectionId,
}: {
	paper: FeedPaper;
	customCollectionId: string;
}) {
	const { data: activity, isLoading } = useQuery({
		queryKey: ["activity", paper.id],
		queryFn: async () => {
			return await activityAction(paper.id);
		},
	});

	if (isLoading) {
		return undefined;
	}

	return (
		<>
			<div className="mt-2">
				<EmbedableLink path={paper.path} spaceId={customCollectionId}>
					<EngagementIndicator
						posts={activity?.posts ?? []}
						readers={activity?.readers ?? []}
						maxAvatars={3}
					/>
				</EmbedableLink>
			</div>
		</>
	);
}
