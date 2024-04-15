"use client";

import {
	Button,
	Card,
	CardBullet,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Header4,
	ScrollArea,
	ScrollBar,
} from "@proemial/shadcn-ui";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useState } from "react";

const dummyPapers = [
	{
		id: "1",
		title: "The Role of the Brain in the Evolution of the Human Hand",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
	{
		id: "2",
		title: "The Statistical Interpretation of Quantum Mechanics",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
	{
		id: "3",
		title: "Calculating Wave Functions in Crystals",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
	{
		id: "4",
		title: "The Role of the Brain in the Evolution of the Human Hand",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
	{
		id: "5",
		title: "The Statistical Interpretation of Quantum Mechanics",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
	{
		id: "6",
		title: "Calculating Wave Functions in Crystals",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
];

export function ChatPapersAskCards() {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="w-full space-y-2"
		>
			<div className="flex items-center justify-between space-x-4">
				<div className="flex items-center gap-4">
					<FileText className="size-4" />
					<Header4>Research Papers Found</Header4>
				</div>
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="sm" className="p-0 w-9">
						{isOpen ? (
							<ChevronUp className="w-4 h-4" />
						) : (
							<ChevronDown className="w-4 h-4" />
						)}

						<span className="sr-only">Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="space-y-2">
				<ScrollArea className="w-full pb-4 rounded-md whitespace-nowrap">
					<div className="flex space-x-3 w-max">
						{dummyPapers.map((paper, i) => (
							<Card key={i} variant="paper">
								<CardHeader variant="paperAsk">
									<CardBullet variant="numbered">{i + 1}</CardBullet>
									<CardDescription variant="paperDate">
										{paper.date}
									</CardDescription>
								</CardHeader>
								<CardContent variant="paper">
									<CardTitle variant="paper">{paper.title}</CardTitle>
								</CardContent>
								<CardFooter>
									<CardDescription variant="paperPublisher">
										{paper.publisher}
									</CardDescription>
								</CardFooter>
							</Card>
						))}
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</CollapsibleContent>
		</Collapsible>
	);
}
