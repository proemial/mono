"use client";

import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@proemial/shadcn-ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";
import { useState } from "react";

type CollapsibleSection = {
	trigger: React.ReactNode;
	children: React.ReactNode;
	extra?: React.ReactNode;
};

export function CollapsibleSection({
	children,
	trigger,
	extra,
}: CollapsibleSection) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="w-full space-y-2"
		>
			<CollapsibleTrigger asChild>
				<div className="flex items-center justify-between space-x-4 cursor-pointer">
					{trigger}

					<div className="flex items-center">
						{extra}
						<Button variant="ghost" size="sm" className="p-0 w-9">
							{isOpen ? (
								<ChevronUp className="w-4 h-4" />
							) : (
								<ChevronDown className="w-4 h-4" />
							)}

							<span className="sr-only">Toggle</span>
						</Button>
					</div>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="space-y-2">{children}</CollapsibleContent>
		</Collapsible>
	);
}
