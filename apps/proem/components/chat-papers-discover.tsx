"use client";

import { PaperCardDiscover } from "@/components/paper-card-discover";
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
import * as React from "react";
import { PaperCardDiscoverProfile } from "./paper-card-discover-profile";

export function ChatPapersDiscover() {
	const [isOpen, setIsOpen] = React.useState(true);

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="w-full space-y-2"
		>
			<div className="flex items-center justify-between space-x-4">
				<div className="flex items-center gap-4">
					<FileText className="size-4" />
					<Header4>Research Paper</Header4>
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
						<PaperCardDiscover
							paper={{
								id: "1",
								title:
									"The Role of the Brain in the Evolution of the Human Hand",
								date: "2021.10.10",
								publisher: "American Physical Society",
								type: "www",
							}}
						/>
						<PaperCardDiscoverProfile name="Juliana Mejia" />
						<PaperCardDiscoverProfile name="Juliana Mejia" />
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</CollapsibleContent>
		</Collapsible>
	);
}
