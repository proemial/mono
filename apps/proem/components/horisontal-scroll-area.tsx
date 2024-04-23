import { ScrollArea, ScrollBar } from "@proemial/shadcn-ui";

export function HorisontalScrollArea({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="-mx-4">
			<ScrollArea className="w-full">
				<div className="flex px-3 py-4 space-x-3 w-max">{children}</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
