import Markdown from "@/app/(pages)/(app)/paper/oa/[id]/markdown";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	Icons,
} from "@proemial/shadcn-ui";

export type PaperCardProps = {
	date?: string;
	header: React.ReactNode;
	loading?: boolean;
	publisher?: string;
	title: string;
};

export function PaperCard({
	date,
	title,
	publisher,
	header,
	loading,
}: PaperCardProps) {
	return (
		<Card variant="paper">
			<CardHeader>
				{header}
				<CardDescription variant="paperDate">
					{date?.replaceAll("-", ".")}
				</CardDescription>
			</CardHeader>

			{loading ? (
				<div className="flex items-center justify-center mx-auto size-24">
					<Icons.loader />
				</div>
			) : (
				<CardTitle variant="paper" className="line-clamp-4 mb-3.5 mt-4">
					<Markdown>{title}</Markdown>
				</CardTitle>
			)}

			{publisher && (
				<CardDescription variant="paperPublisher" className="line-clamp-2">
					{publisher}
				</CardDescription>
			)}
		</Card>
	);
}
