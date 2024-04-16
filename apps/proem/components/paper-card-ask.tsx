import { PapersFetched } from "@/app/api/bot/answer-engine/events";
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

interface PaperCardAskProps {
	paper: PapersFetched[number] | undefined;
	index: string;
}

export function PaperCardAsk({ paper, index }: PaperCardAskProps) {
	return (
		<Card variant="paper">
			<CardHeader variant="paperAsk">
				<CardBullet variant="numbered">{index}</CardBullet>
				{paper && (
					<CardDescription variant="paperDate">
						{paper.published}
					</CardDescription>
				)}
			</CardHeader>
			<CardContent variant="paperAsk">
				{paper && <CardTitle variant="paper">{paper.title}</CardTitle>}
				{!paper && (
					<div className="flex items-center justify-center mx-auto size-24">
						<Icons.loader />
					</div>
				)}
			</CardContent>
			{/* {paper && (
				<CardFooter>
					<CardDescription variant="paperPublisher">
						{paper.publisher}
					</CardDescription>
				</CardFooter>
			)} */}
		</Card>
	);
}
