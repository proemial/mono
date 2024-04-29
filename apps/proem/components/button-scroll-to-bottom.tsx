"use client";
import { screenMaxWidth } from "@/app/constants";
import { Button } from "@proemial/shadcn-ui";
import { ChevronDown } from "@untitled-ui/icons-react";

export function ButtonScrollToBottom() {
	return (
		<div
			className={`${screenMaxWidth} fixed inset-x-0 bottom-0 z-10 w-full mx-auto overflow-visible`}
		>
			<div className="flex justify-center pb-24">
				<Button size="icon">
					<ChevronDown className="size-4" />
				</Button>
			</div>
		</div>
	);
}
