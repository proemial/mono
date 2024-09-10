"use client";

import { Field } from "@/app/data/oa-fields";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { EmbedableLink } from "@/components/embedable-link";
import { isEmbedded } from "@/utils/url";
import { usePathname } from "next/navigation";

export type FeedItemTagLink = {
	path: string;
	spaceId?: string;
	field?: Field | null;
	openAssistant: boolean;
};

export const FeedItemTag = ({
	tag,
	linkTo,
}: { tag: string; linkTo: FeedItemTagLink }) => {
	const pathname = usePathname();
	const embedded = isEmbedded(pathname);

	const background = embedded ? "bg-primary/90" : "bg-theme-200/30";

	// inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground uppercase text-2xs hover:bg-primary/90 h-6 px-4 py-2 rounded-full font-[9px]
	return (
		<EmbedableLink {...linkTo}>
			<div
				className={`inline-flex items-center justify-center whitespace-nowrap uppercase text-2xs h-6 px-4 py-2 rounded-full ${background}`}
				onClick={trackHandler(analyticsKeys.feed.click.tag)}
			>
				{tag}
			</div>
		</EmbedableLink>
	);
};
