import { oaFieldIconMap } from "@/app/data/oa-fields";
import { oaTopicsTranslationMap } from "@proemial/papers/oa/taxonomy/oa-topics-compact";
import { trimForQuotes } from "@/utils/string-utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReactNode, useMemo } from "react";
import Markdown from "react-markdown";
import { FeedItemCard } from "./feed-item-card";
import { FeedItemTag } from "./feed-item-tag";
import { Prefix } from "@proemial/redis/adapters/papers";
import { RankedPaperFeature } from "@/components/fingerprints/fetch-by-features";
import { FeatureType } from "@/components/fingerprints/features";
import { OpenAlexPaper } from "@proemial/papers/oa/models/oa-paper";

dayjs.extend(relativeTime);

type FeedItemProps = {
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
}: FeedItemProps) {
	const tags = paper.data.topics
		?.map((topic) => oaTopicsTranslationMap[topic.id]?.["short-name"])
		.filter(Boolean) as string[];

	const fields =
		paper.data.topics?.map((topic) => ({
			id: topic.field.id,
			score: topic.score,
		})) ?? [];

	const field = useMemo(() => {
		if (fields.length === 0) {
			return undefined;
		}
		const field = fields.reduce((prev, current) =>
			prev.score > current.score ? prev : current,
		);
		return oaFieldIconMap[field.id];
	}, [fields]);

	return (
		<div className="space-y-3">
			<FeedItemCard
				id={paper.id}
				date={paper.data.publication_date}
				field={field}
				provider={provider}
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
