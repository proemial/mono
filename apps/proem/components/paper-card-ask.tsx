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
	paper?: any;
	cardKey?: React.Key;
	index?: string;
}

export function PaperCardAsk({ paper, cardKey, index }: PaperCardAskProps) {
	return (
		<Card key={cardKey} variant="paper">
			<CardHeader variant="paperAsk">
				<CardBullet variant="numbered">{index}</CardBullet>
				{paper && (
					<CardDescription variant="paperDate">{paper.date}</CardDescription>
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
			{paper && (
				<CardFooter>
					<CardDescription variant="paperPublisher">
						{paper.publisher}
					</CardDescription>
				</CardFooter>
			)}
		</Card>
	);
}
