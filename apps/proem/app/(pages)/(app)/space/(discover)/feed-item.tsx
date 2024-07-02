"use client";
import { togglePaperInCollection } from "@/app/(pages)/(app)/space/(discover)/bookmark-paper";
import Markdown from "@/components/markdown";
import { trimForQuotes } from "@/utils/string-utils";
import { Prefix } from "@proemial/redis/adapters/papers";
import { FeatureType } from "@proemial/repositories/oa/fingerprinting/features";
import { RankedPaperFeature } from "@proemial/repositories/oa/fingerprinting/rerank";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { oaTopicsTranslationMap } from "@proemial/repositories/oa/taxonomy/oa-topics-compact";
import { Button, cn } from "@proemial/shadcn-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReactNode, useState } from "react";
import { FeedItemCard, FeedItemCardProps } from "./feed-item-card";
import { FeedItemTag } from "./feed-item-tag";

dayjs.extend(relativeTime);

export type FeedItemProps = Pick<
	FeedItemCardProps,
	"isBookmarked" | "customCollectionId"
> & {
	paper: OpenAlexPaper;
	fingerprint?: RankedPaperFeature[];
	provider?: Prefix;
	children?: ReactNode;
};

export default function FeedItem({
	paper,
	fingerprint,
	provider,
	children,
	isBookmarked,
	customCollectionId,
}: FeedItemProps) {
	// TODO! This has to work on /latest page
	const [isDisabled, setIsDisabled] = useState(false);
	const onBookmarkToggleClick = (isDisabled: boolean) =>
		setIsDisabled(isDisabled);
	const tags = paper.data.topics
		?.map((topic) => oaTopicsTranslationMap[topic.id]?.["short-name"])
		.filter(Boolean) as string[];

	return (
		<div className="relative">
			{isDisabled && (
				<div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full">
					{customCollectionId && (
						<Button
							type="button"
							variant="default"
							className="bg-white pointer-events-auto dark:bg-primary drop-shadow-xl hover:drop-shadow-lg"
							onClick={async () => {
								setIsDisabled(false);
								await togglePaperInCollection({
									paperId: paper.id,
									collectionId: customCollectionId,
									isEnabled: true,
								});
							}}
						>
							BRING BACK BOOKMARK
						</Button>
					)}
				</div>
			)}

			<div
				className={cn("z-0 space-y-3", {
					"opacity-50 pointer-events-auto  blur-sm": isDisabled,
				})}
			>
				<FeedItemCard
					isBookmarked={isBookmarked}
					id={paper.id}
					onBookmarkToggleClick={onBookmarkToggleClick}
					date={paper.data.publication_date}
					topics={paper.data.topics}
					provider={provider}
					customCollectionId={customCollectionId}
					hasAbstract={!!paper.data.abstract}
				>
					<Markdown>
						{paper.generated?.title
							? trimForQuotes(paper.generated.title)
							: paper.data.title}
					</Markdown>
				</FeedItemCard>

				{children}

				<div className="flex gap-2 overflow-x-auto scrollbar-hide">
					{!fingerprint &&
						tags?.map((tag) => <FeedItemTag key={tag} tag={tag} />)}

					{fingerprint && <FeatureTags features={fingerprint} />}
				</div>
			</div>
		</div>
	);
}

function FeatureTags({ features }: { features: RankedPaperFeature[] }) {
	const sorted = [...features]
		.filter((f) => !f.irrelevant)
		.sort((a, b) => typeScore(b.type) - typeScore(a.type));

	const deduped = [] as RankedPaperFeature[];
	for (const feature of sorted) {
		if (deduped.find((f) => f.label === feature.label)) {
			continue;
		}
		deduped.push(feature);
	}

	return (
		<div className="flex flex-row gap-2 overflow-x-auto scrollbar-hide">
			{deduped.slice(0, 3).map((feature) => (
				<FeedItemTag key={feature.id} tag={feature.label} />
			))}
		</div>
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
