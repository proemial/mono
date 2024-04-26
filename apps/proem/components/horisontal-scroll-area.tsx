import { ScrollArea, ScrollBar } from "@proemial/shadcn-ui";

export function HorisontalScrollArea({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="-m-4">
			<ScrollArea className="w-full pb-3">
				<div className="flex px-4 pb-3 space-x-3 pt-7 w-max scrollbar-hide">
					{children}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
