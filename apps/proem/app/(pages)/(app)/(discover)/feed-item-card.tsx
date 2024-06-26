"use client";

import {
	AddToCollectionButton,
	AddToCollectionButtonProps,
} from "@/app/(pages)/(app)/(discover)/add-to-collection-button";
import { Field } from "@/app/data/oa-fields";
import { useInternalUser } from "@/app/hooks/use-user";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { Prefix } from "@proemial/redis/adapters/papers";
import { OpenAlexTopic } from "@proemial/repositories/oa/models/oa-paper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { ReactNode } from "react";
import { FeedItemField } from "./feed-item-field";

dayjs.extend(relativeTime);

export type FeedItemCardProps = Pick<
	AddToCollectionButtonProps,
	"bookmarks" | "customCollectionId"
> & {
	id: string;
	date: string;
	topics?: OpenAlexTopic[];
	children: ReactNode;
	provider?: Prefix;
};

export const FeedItemCard = ({
	id,
	date,
	topics,
	children,
	provider,
	bookmarks,
	customCollectionId,
}: FeedItemCardProps) => {
	const { isInternal } = useInternalUser();

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-2">
				<FeedItemField topics={topics} />
				<div className="flex items-center">
					<div className="uppercase text-2xs text-nowrap">
						{dayjs(date).fromNow()}
					</div>
					{isInternal ? (
						<div className="-mr-2">
							<Trackable
								trackingKey={analyticsKeys.collection.addPaper.fromAsk}
							>
								<AddToCollectionButton
									fromTrackingKey="fromFeed"
									bookmarks={bookmarks}
									paperId={id}
									customCollectionId={customCollectionId}
								/>
							</Trackable>
						</div>
					) : null}
				</div>
			</div>
			<Link
				href={`/paper/${provider ?? "oa"}/${id}`}
				onClick={trackHandler(analyticsKeys.feed.click.card)}
			>
				{children}
			</Link>
		</div>
	);
};
