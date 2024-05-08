import Summary from "@/app/(pages)/(app)/paper/oa/[id]/summary";
import { oaFieldIconMap } from "@/app/data/oa-fields";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo } from "react";
import { FeedItemCard } from "./feed-item-card";
import { FeedItemTag } from "./feed-item-tag";

dayjs.extend(relativeTime);

type FeedItemProps = {
	id: string;
	date: string;
	fields: Array<{
		id: string;
		score: number;
	}>;
	tags: string[];
};

export default function FeedItem({ date, id, fields, tags }: FeedItemProps) {
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
			<FeedItemCard id={id} date={date} field={field}>
				<Summary id={id} />
			</FeedItemCard>
			<div className="flex flex-row-reverse gap-2 overflow-x-auto scrollbar-hide">
				{tags.map((tag) => (
					<FeedItemTag key={tag} tag={tag} />
				))}
			</div>
		</div>
	);
}
