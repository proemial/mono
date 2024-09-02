"use client";

import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import { Field } from "@/app/data/oa-fields";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import {
	PaperMetaData,
	PaperMetaDataProps,
} from "@/components/paper-meta-data"; // Updated import
import { routes } from "@/routes";
import { isEmbedded } from "@/utils/url";
import { Prefix } from "@proemial/redis/adapters/papers";
import { AlertTriangle } from "@untitled-ui/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";

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
	const field = useMemo(
		() => topics && getFieldFromOpenAlexTopics(topics),
		[topics],
	);

	return (
		<div className="flex flex-col gap-3">
			<EmbedableLink
				path={`/paper/${provider ?? "oa"}/${id}`}
				customCollectionId={customCollectionId}
				field={field}
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

function EmbedableLink({
	children,
	customCollectionId,
	path,
	field,
}: {
	children: ReactNode;
	path: string;
	customCollectionId?: string;
	field?: Field | null;
}) {
	const baseurl = useBaseUrl();
	console.log("baseurl", baseurl);

	const pathname = usePathname();
	const embedded = isEmbedded(pathname);
	console.log("embedded", embedded);

	const space =
		embedded || (pathname.includes(routes.space) && customCollectionId)
			? `${routes.space}/${pathname.split("/")[2]}`
			: "";
	console.log("space", space);

	const theme =
		// Only add the theme manually if the space is a personal collection
		!space.includes("col_") && field
			? `?color=${field.theme.color}${
					field.theme.image ? `&image=${field.theme.image}` : ""
				}`
			: "";

	console.log(`${baseurl}${space}${path}${theme}`);

	return (
		<Link
			href={`${baseurl}${space}${path}${theme}`}
			onClick={trackHandler(analyticsKeys.feed.click.card)}
			target={embedded ? "_blank" : undefined}
		>
			{children}
		</Link>
	);
}

function useBaseUrl() {
	return typeof window !== "undefined" && window.location.origin
		? window.location.origin
		: "";
}
