"use client";

import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import {
	PaperMetaData,
	PaperMetaDataProps,
} from "@/components/paper-meta-data"; // Updated import
import { routes } from "@/routes";
import { Prefix } from "@proemial/redis/adapters/papers";
import { AlertTriangle } from "@untitled-ui/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { isEmbedded } from "@/utils/url";

export type FeedItemCardProps = PaperMetaDataProps & {
	children: ReactNode;
	hasAbstract: boolean;
	provider?: Prefix;
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
	index,
}: FeedItemCardProps) => {
	const pathname = usePathname();
	const field = useMemo(
		() => topics && getFieldFromOpenAlexTopics(topics),
		[topics],
	);

	const embedded = isEmbedded(pathname);
	const spaceSpecificPrefix =
		embedded || (pathname.includes(routes.space) && customCollectionId)
			? `${routes.space}/${pathname.split("/")[2]}`
			: "";

	const embedPrefix = embedded
		? `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
		: "";

	return (
		<div className="flex flex-col gap-3">
			<Link
				href={`${embedPrefix}${spaceSpecificPrefix}/paper/${provider ?? "oa"}/${id}${
					!spaceSpecificPrefix && field
						? `?color=${field.theme.color}${
								field.theme.image ? `&image=${field.theme.image}` : ""
							}`
						: ""
				}`}
				onClick={trackHandler(analyticsKeys.feed.click.card)}
				target={embedded ? "_blank" : undefined}
			>
				{hasAbstract ? (
					<div>
						<PaperMetaData
							topics={topics}
							date={date}
							readonly={readonly}
							isBookmarked={isBookmarked}
							id={id}
							customCollectionId={customCollectionId}
							onBookmarkToggleClick={onBookmarkToggleClick}
							index={index}
						/>
						{children}
					</div>
				) : (
					<>
						<div className="flex items-center gap-2 font-bold">
							<AlertTriangle className="size-4 opacity-85" />
							This paper is not publicly available.
						</div>
						<div className="text-muted-foreground">{children}</div>
					</>
				)}
			</Link>
		</div>
	);
};
