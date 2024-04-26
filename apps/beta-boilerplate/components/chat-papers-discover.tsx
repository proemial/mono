"use client";

import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Header4 } from "@/components/ui/typography";
import { dummyPapers } from "@/lib/definitions";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import * as React from "react";
import { PaperCardDiscover } from "./paper-card-discover";
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
				<div className="flex gap-4 items-center">
					<FileText className="size-4" />
					<Header4>Research Paper</Header4>
				</div>
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="sm" className="w-9 p-0">
						{isOpen ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}

						<span className="sr-only">Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="space-y-2">
				<ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
					<div className="flex w-max space-x-3">
						<PaperCardDiscover paper={dummyPapers[0]} />
						<PaperCardDiscoverProfile name="Juliana Mejia" />
						<PaperCardDiscoverProfile name="Juliana Mejia" />
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</CollapsibleContent>
		</Collapsible>
	);
}
