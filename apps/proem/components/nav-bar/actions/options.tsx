"use client";

import {
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@proemial/shadcn-ui";
import { DotsHorizontal } from "@untitled-ui/icons-react";

export function Options() {
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
				className="border-none shadow-2xl rounded-xl p-0 w-auto"
			>
				<ul className="divide-y">
					<OptionsListItem>Audio</OptionsListItem>
					<OptionsListItem>Invite a friend</OptionsListItem>
					<OptionsListItem>View saved items</OptionsListItem>
					<OptionsListItem>Show why</OptionsListItem>
				</ul>
			</PopoverContent>
		</Popover>
	);
}

function OptionsListItem({ children }: { children: React.ReactNode }) {
	return <li className="py-2 px-4 text-base cursor-pointer">{children}</li>;
}
