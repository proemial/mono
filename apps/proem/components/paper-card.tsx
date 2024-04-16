import {
	Card,
	CardBullet,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@proemial/shadcn-ui";
import { Globe } from "lucide-react";

export type PaperCardProps = {
	date: string;
	title: string;
	publisher: string;
	bullet: React.ReactNode;
};

export function PaperCard({ date, title, publisher }: PaperCardProps) {
	return (
		<Card variant="paper">
			<CardHeader>
				<CardBullet>
					<Globe className="size-4" />
				</CardBullet>
				<CardDescription variant="paperDate">
					{date.replaceAll("-", ".")}
				</CardDescription>
			</CardHeader>
			<CardContent variant="paper">
				<CardTitle variant="paper" className="line-clamp-4">
					{title}
				</CardTitle>
			</CardContent>
			<CardFooter className="pb-0">
				<CardDescription variant="paperPublisher">{publisher}</CardDescription>
			</CardFooter>
		</Card>
	);
}
