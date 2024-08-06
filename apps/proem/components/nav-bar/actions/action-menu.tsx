"use client";

import {
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@proemial/shadcn-ui";
import { DotsHorizontal } from "@untitled-ui/icons-react";

export function ActionMenu({ children }: { children: React.ReactNode }) {
	return (
		<Popover>
			<PopoverTrigger>
				<Button variant="ghost" type="button" size="icon" className="-mr-3">
					<DotsHorizontal className="size-5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="left"
				align="start"
				className="border-none shadow-2xl rounded-xl p-0 w-auto divide-y *:py-2 *:px-4 text-base *:cursor-pointer"
			>
				{children}
			</PopoverContent>
		</Popover>
	);
}
