"use client";

import { Button } from "@proemial/shadcn-ui";
import { ChevronDown } from "lucide-react";

export function ButtonScrollToBottom() {
	return (
		<div className="fixed inset-x-0 bottom-0 z-10 w-full max-w-screen-md mx-auto overflow-visible">
			<div className="flex justify-center pb-24">
				<Button size="icon">
					<ChevronDown className="size-4" />
				</Button>
			</div>
		</div>
	);
}
