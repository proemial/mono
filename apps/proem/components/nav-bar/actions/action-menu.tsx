"use client";

import {
	Button,
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@proemial/shadcn-ui";
import { DotsHorizontal } from "@untitled-ui/icons-react";
import React from "react";

export function ActionMenu({ children }: { children: React.ReactNode }) {
	return (
		<Popover>
			<PopoverTrigger>
				<Button
					variant="ghost"
					type="button"
					size="icon"
					className="-mr-3"
					asChild
				>
					<div>
						<DotsHorizontal className="size-5" />
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="bottom"
				align="end"
				alignOffset={-6}
				sideOffset={0}
				className="border-none shadow-2xl rounded-xl p-0 w-auto divide-y *:py-2 *:px-4 text-base *:cursor-pointer *:block min-w-44"
			>
				{React.Children.map(children, (child) => (
					<PopoverClose asChild>{child}</PopoverClose>
				))}
			</PopoverContent>
		</Popover>
	);
}
