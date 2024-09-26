"use client";

import {
	AddToCollectionButton,
	AddToCollectionButtonProps,
} from "@/app/(pages)/(app)/space/(discover)/add-to-collection-button";
import { FeedItemField } from "@/app/(pages)/(app)/space/(discover)/feed-item-field";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { formatDate } from "@/utils/date";
import { OpenAlexTopic } from "@proemial/repositories/oa/models/oa-paper";
import { CardBullet } from "@proemial/shadcn-ui";

export type PaperMetaDataProps = Pick<
	AddToCollectionButtonProps,
	"isBookmarked" | "customCollectionId"
> & {
	date: string;
	id: string;
	onBookmarkToggleClick?: AddToCollectionButtonProps["onClick"];
	readonly?: boolean;
	topics?: OpenAlexTopic[];
	index?: number;
	embedded?: boolean;
};

export const PaperMetaData = ({
	topics,
	date,
	readonly,
	isBookmarked,
	id,
	customCollectionId,
	onBookmarkToggleClick,
	index,
	embedded,
}: PaperMetaDataProps) => {
	return (
		<div className="flex items-center justify-between gap-2 mb-1">
			<FeedItemField topics={topics} />
			<div className="flex items-center gap-2 ">
				{!embedded && (
					<div className="uppercase text-2xs text-nowrap">
						{formatDate(date, "relative")}
					</div>
				)}
				{!readonly && (
					<div
						className="-m-2 min-h-10 min-w-10"
						onClick={(event) => {
							// Prevent triggering the parent a tag when clicking the button
							event.preventDefault();
						}}
					>
						<Trackable trackingKey={analyticsKeys.collection.addPaper.fromAsk}>
							<AddToCollectionButton
								onClick={onBookmarkToggleClick}
								fromTrackingKey="fromFeed"
								isBookmarked={isBookmarked}
								paperId={id}
								customCollectionId={customCollectionId}
							/>
						</Trackable>
					</div>
				)}
				{readonly && index && (
					<CardBullet variant="numbered" className="inline-block pt-0">
						{index}
					</CardBullet>
				)}
			</div>
		</div>
	);
};
