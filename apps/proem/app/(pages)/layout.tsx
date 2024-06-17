import { cn } from "@proemial/shadcn-ui";
import { screenMaxWidth } from "../constants";

export default function PagesLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className={cn("mx-auto min-h-[100dvh] flex flex-col", screenMaxWidth)}>
			{children}
		</div>
	);
}
