"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { EmbedableLink } from "./link";
import { isEmbedded } from "@/utils/url";
import { usePathname } from "next/navigation";
import { FeedPaper } from "./card";
import { RankedPaperFeature } from "@proemial/repositories/oa/fingerprinting/rerank";
import { FeatureType } from "@proemial/repositories/oa/fingerprinting/features";

export function PaperTags({
	paper,
	features,
	tags,
	spaceId,
}: {
	paper: FeedPaper;
	features?: RankedPaperFeature[];
	tags?: string[];
	spaceId?: string;
}) {
	const sorted = features?.length
		? [...features]
				.filter((f) => !f.irrelevant)
				.sort((a, b) => typeScore(b.type) - typeScore(a.type))
		: [];

	const deduped = [] as RankedPaperFeature[];
	for (const feature of sorted) {
		if (deduped.find((f) => f.label === feature.label)) {
			continue;
		}
		deduped.push(feature);
	}

	if (deduped.length === 0) {
		return (
			<>
				{tags?.slice(0, 3).map((tag) => (
					<FeedItemTag key={tag} paper={paper} tag={tag} spaceId={spaceId} />
				))}
			</>
		);
	}

	return (
		<>
			{deduped.slice(0, 3).map((feature) => (
				<FeedItemTag
					key={feature.id}
					paper={paper}
					tag={feature.label}
					spaceId={spaceId}
				/>
			))}
		</>
	);
}

function typeScore(type: FeatureType) {
	switch (type) {
		case "keyword":
			return 9;
		case "topic":
			return 0.5;
		default:
			return 0.3;
	}
}

export const FeedItemTag = ({
	paper,
	tag,
	spaceId,
}: {
	paper: FeedPaper;
	tag: string;
	spaceId?: string;
}) => {
	const pathname = usePathname();
	const embedded = isEmbedded(pathname);

	const background = embedded ? "bg-primary/90" : "bg-theme-200/30";

	// inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground uppercase text-2xs hover:bg-primary/90 h-6 px-4 py-2 rounded-full font-[9px]
	return (
		<EmbedableLink path={paper.path} spaceId={spaceId}>
			<div
				className={`inline-flex items-center justify-center whitespace-nowrap uppercase text-2xs h-6 px-4 py-2 rounded-full ${background}`}
				onClick={trackHandler(analyticsKeys.feed.click.tag)}
			>
				{tag}
			</div>
		</EmbedableLink>
	);
};
