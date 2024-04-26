import { ScrollArea, ScrollBar } from "@proemial/shadcn-ui";

export function HorisontalScrollArea({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="-m-4">
			<ScrollArea className="w-full">
				<div className="flex p-4 space-x-3 w-max">{children}</div>
				<ScrollBar
					orientation="horizontal"
					className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
				/>
			</ScrollArea>
		</div>
	);
}
