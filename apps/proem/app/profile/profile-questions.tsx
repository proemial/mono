"use client";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Header4,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@proemial/shadcn-ui";
import { ChevronDown, ChevronUp } from "@untitled-ui/icons-react";
import * as React from "react";

export function ProfileQuestions() {
	const [isOpen, setIsOpen] = React.useState(true);

	const questions = [
		"What are the underlying principles of quantum entanglement?",
		"How can we effectively reverse the impacts of climate change on biodiversity?",
	];

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger className="w-full">
				<div className="flex items-center place-content-between">
					<div className="flex items-center gap-4">
						<Header4>Questions</Header4>
					</div>
					<div className="flex items-center gap-2">
						<p>{questions.length}</p>
						{isOpen ? (
							<ChevronUp className="w-4 h-4" />
						) : (
							<ChevronDown className="w-4 h-4" />
						)}
					</div>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="pt-2">
				<Table className="text-base">
					<TableBody>
						{questions.map((question, index) => (
							<TableRow key={index}>
								<TableCell variant="text">
									<p className="line-clamp-1">{question}</p>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CollapsibleContent>
		</Collapsible>
	);
}
