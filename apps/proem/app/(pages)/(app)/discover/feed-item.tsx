import { trimForQuotes } from "@/utils/string-utils";
import { Prefix } from "@proemial/redis/adapters/papers";
import { FeatureType } from "@proemial/repositories/oa/fingerprinting/features";
import { RankedPaperFeature } from "@proemial/repositories/oa/fingerprinting/rerank";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { oaTopicsTranslationMap } from "@proemial/repositories/oa/taxonomy/oa-topics-compact";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReactNode } from "react";
import { FeedItemCard, FeedItemCardProps } from "./feed-item-card";
import { FeedItemTag } from "./feed-item-tag";
import Markdown from "@/components/markdown";

dayjs.extend(relativeTime);

export type FeedItemProps = Pick<
	FeedItemCardProps,
	"bookmarks" | "customCollectionId"
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
	bookmarks,
	customCollectionId,
}: FeedItemProps) {
	const tags = paper.data.topics
		?.map((topic) => oaTopicsTranslationMap[topic.id]?.["short-name"])
		.filter(Boolean) as string[];

	return (
		<div className="space-y-3">
			<FeedItemCard
				id={paper.id}
				date={paper.data.publication_date}
				topics={paper.data.topics}
				provider={provider}
				bookmarks={bookmarks}
				customCollectionId={customCollectionId}
			>
				<Markdown>
					{paper.generated?.title
						? trimForQuotes(paper.generated.title)
						: paper.data.title}
				</Markdown>
			</FeedItemCard>

			{children}

			<div className="flex flex-row-reverse gap-2 overflow-x-auto scrollbar-hide">
				{!fingerprint &&
					tags?.map((tag) => <FeedItemTag key={tag} tag={tag} />)}

				{fingerprint && <FeatureTags features={fingerprint} />}
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
