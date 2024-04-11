"use client";

import { PaperCardAsk } from "@/components/paper-card-ask";
import {
	Button,
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

export function ChatPapersAsk({ loading }: { loading: boolean }) {
	const [isOpen, setIsOpen] = useState(true);

	const headers = {
		loading: "Research papers found",
		loaded: "Research papers interrogated",
	};

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="w-full space-y-2"
		>
			<div className="flex items-center justify-between space-x-4">
				<div className="flex items-center gap-4">
					<FileText className="size-4" />
					<Header4>{loading ? headers.loading : headers.loaded}</Header4>
				</div>
				<div className="flex items-center">
					{dummyPapers.length}
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
			</div>
			<CollapsibleContent className="space-y-2">
				<ScrollArea className="w-full pb-4 rounded-md whitespace-nowrap">
					<div className="flex space-x-3 w-max">
						{/* {dummyPapers.map((paper, i) => (
                            <PaperCardAsk paper={paper} key={i} index={`${i + 1}`} />
                        ))} */}
						<PaperCardAsk
							key={dummyPapers.length}
							index={`${dummyPapers.length + 1}`}
						/>
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</CollapsibleContent>
		</Collapsible>
	);
}
