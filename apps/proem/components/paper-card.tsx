import {
	Card,
	CardBullet,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Icons,
} from "@proemial/shadcn-ui";
import { Globe } from "lucide-react";

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

			<CardContent>
				{loading ? (
					<div className="flex items-center justify-center mx-auto size-24">
						<Icons.loader />
					</div>
				) : (
					<CardTitle variant="paper" className="line-clamp-4">
						{title}
					</CardTitle>
				)}
			</CardContent>

			{publisher && (
				<CardFooter>
					<CardDescription variant="paperPublisher">
						{publisher}
					</CardDescription>
				</CardFooter>
			)}
		</Card>
	);
}
