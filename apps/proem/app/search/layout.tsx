import { NavigationMenuBar } from "@/components/navigation-menu-bar";
import { cn } from "@proemial/shadcn-ui";
import { screenMaxWidth } from "../constants";

export default function PagesLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className={cn("mx-auto min-h-[100dvh] flex flex-col", screenMaxWidth)}>
			<NavigationMenuBar title="Search" />
			<main className="w-full p-4 pb-0 flex flex-col flex-grow">
				{children}
			</main>
		</div>
	);
}
