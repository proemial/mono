import Summary from "@/app/(pages)/(app)/paper/oa/[id]/summary";
import { oaFieldIconMap } from "@/app/data/oa-fields";
import { Button } from "@proemial/shadcn-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useMemo } from "react";

dayjs.extend(relativeTime);

type FeedItemProps = {
	id: string;
	date: string;
	fields?: Array<{
		id: string;
		score: number;
	}>;
	tags: string[];
};

export default function FeedItem({ date, id, fields, tags }: FeedItemProps) {
	const field = useMemo(() => {
		if (!fields || fields.length === 0) {
			return undefined;
		}
		const field = fields.reduce((prev, current) =>
			prev.score > current.score ? prev : current,
		);
		return oaFieldIconMap[field.id];
	}, [fields]);

	return (
		<div className="space-y-3">
			<Link href={`/paper/oa/${id}`}>
				<div className="space-y-3">
					<div className="flex items-center justify-between gap-2">
						{field ? (
							<div className="flex items-center gap-2">
								{field.icon}
								<div className="text-xs uppercase line-clamp-1">
									{field.displayName}
								</div>
							</div>
						) : (
							<div />
						)}
						<div className="uppercase text-2xs">{dayjs(date).fromNow()}</div>
					</div>

					<Summary id={id} />
				</div>
			</Link>
			<div className="flex flex-row-reverse gap-2 overflow-x-auto scrollbar-hide">
				{tags.map((tag) => (
					<Button key={tag} size="pill">
						{tag}
					</Button>
				))}
			</div>
		</div>
	);
}
