"use client";

import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import { EmbedableLink } from "@/components/embedable-link";
import {
	PaperMetaData,
	PaperMetaDataProps,
} from "@/components/paper-meta-data"; // Updated import
import { Prefix } from "@proemial/redis/adapters/papers";
import { AlertTriangle } from "@untitled-ui/icons-react";
import { ReactNode, useMemo } from "react";

export type FeedItemCardProps = PaperMetaDataProps & {
	children: ReactNode;
	hasAbstract: boolean;
	provider?: Prefix;
	feedType?: string;
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
	feedType,
	index,
}: FeedItemCardProps) => {
	const field = useMemo(
		() => topics && getFieldFromOpenAlexTopics(topics),
		[topics],
	);

	return (
		<div className="flex flex-col gap-3">
			<EmbedableLink
				path={`/paper/${provider ?? "oa"}/${id}`}
				spaceId={customCollectionId}
				field={field}
				feedType={feedType}
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
			</EmbedableLink>
		</div>
	);
};
