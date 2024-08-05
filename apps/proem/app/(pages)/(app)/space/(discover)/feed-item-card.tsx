"use client";

import {
	AddToCollectionButton,
	AddToCollectionButtonProps,
} from "@/app/(pages)/(app)/space/(discover)/add-to-collection-button";
import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { routes } from "@/routes";
import { Prefix } from "@proemial/redis/adapters/papers";
import { OpenAlexTopic } from "@proemial/repositories/oa/models/oa-paper";
import { AlertTriangle } from "@untitled-ui/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { FeedItemField } from "./feed-item-field";

dayjs.extend(relativeTime);

export type FeedItemCardProps = Pick<
	AddToCollectionButtonProps,
	"isBookmarked" | "customCollectionId"
> & {
	id: string;
	date: string;
	topics?: OpenAlexTopic[];
	children: ReactNode;
	provider?: Prefix;
	hasAbstract: boolean;
	onBookmarkToggleClick?: AddToCollectionButtonProps["onClick"];
	readonly?: boolean;
};

export const FeedItemCard = ({
	id,
	date,
	topics,
	children,
	provider,
	isBookmarked,
	customCollectionId,
	hasAbstract,
	onBookmarkToggleClick,
	readonly,
}: FeedItemCardProps) => {
	const pathname = usePathname();
	const field = useMemo(
		() => topics && getFieldFromOpenAlexTopics(topics),
		[topics],
	);
	const spaceSpecificPrefix =
		pathname.includes(routes.space) && customCollectionId
			? `${routes.space}/${pathname.split("/")[2]}`
			: "";
	return (
		<div className="flex flex-col gap-3">
			{hasAbstract && (
				<div>
					<div className="flex items-center justify-between gap-2">
						<FeedItemField topics={topics} />
						<div className="flex items-center">
							<div className="uppercase text-2xs text-nowrap">
								{dayjs(date).fromNow()}
							</div>
							<div className="-mr-2 min-h-10">
								{!readonly && (
									<Trackable
										trackingKey={analyticsKeys.collection.addPaper.fromAsk}
									>
										<AddToCollectionButton
											onClick={onBookmarkToggleClick}
											fromTrackingKey="fromFeed"
											isBookmarked={isBookmarked}
											paperId={id}
											customCollectionId={customCollectionId}
										/>
									</Trackable>
								)}
							</div>
						</div>
					</div>
					<Link
						href={`${spaceSpecificPrefix}/paper/${provider ?? "oa"}/${id}${
							field
								? `?color=${field.theme.color}${
										field.theme.image ? `&image=${field.theme.image}` : ""
									}`
								: ""
						}`}
						onClick={trackHandler(analyticsKeys.feed.click.card)}
					>
						{children}
					</Link>
				</div>
			)}
			{!hasAbstract && (
				<>
					<div className="flex items-center gap-2 font-bold">
						<AlertTriangle className="size-4 opacity-85" />
						This paper is not publicly available.
					</div>
					<div className="text-muted-foreground">{children}</div>
				</>
			)}
		</div>
	);
};
