import { oaFieldIconMap } from "@/app/data/oa-fields";
import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import { trimForQuotes } from "@/utils/string-utils";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReactNode, useMemo } from "react";
import Markdown from "react-markdown";
import { FeedItemCard } from "./feed-item-card";
import { FeedItemTag } from "./feed-item-tag";
import { Prefix } from "@proemial/redis/adapters/papers";

dayjs.extend(relativeTime);

type FeedItemProps = {
	paper: OpenAlexPaper;
	provider?: Prefix;
	children?: ReactNode;
};

export default function FeedItem({ paper, provider, children }: FeedItemProps) {
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
					{paper.generated?.title && trimForQuotes(paper.generated.title)}
				</Markdown>
			</FeedItemCard>

			{children}

			{!children && (
				<div className="flex flex-row-reverse gap-2 overflow-x-auto scrollbar-hide">
					{tags?.map((tag) => (
						<FeedItemTag key={tag} tag={tag} />
					))}
				</div>
			)}
		</div>
	);
}
