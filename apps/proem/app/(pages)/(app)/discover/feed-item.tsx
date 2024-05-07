import { Paper } from "@/components/icons/Paper";
import { Button, Paragraph } from "@proemial/shadcn-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type FeedItemProps = {
	date: string;
	title: string;
	tags: string[];
};

export default function FeedItem({ date, title, tags }: FeedItemProps) {
	return (
		<div className="space-y-3">
			<div className="flex justify-between items-center">
				<Paper />
				<div className="uppercase text-2xs">{dayjs(date).fromNow()}</div>
			</div>
			<Paragraph>{title}</Paragraph>
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
