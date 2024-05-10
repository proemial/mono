import { Summary } from "@/app/(pages)/(app)/paper/oa/[id]/summary";
import { oaFieldIconMap } from "@/app/data/oa-fields";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Loading01 } from "@untitled-ui/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Suspense, useMemo } from "react";
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
	paper: OpenAlexPaper;
};

export default function FeedItem({
	date,
	id,
	paper,
	fields,
	tags,
}: FeedItemProps) {
	console.log(paper);
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
				<Suspense fallback={<Loading01 />}>
					<Summary id={id} paper={paper} />
				</Suspense>
			</FeedItemCard>
			<div className="flex flex-row-reverse gap-2 overflow-x-auto scrollbar-hide">
				{tags.map((tag, i) => (
					<FeedItemTag key={i} tag={tag} />
				))}
			</div>
		</div>
	);
}
