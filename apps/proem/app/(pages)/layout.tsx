import "@/app/globals.css";
import { NavigationMenuBar } from "@/components/navigation-menu-bar";
import "@/env";

export default function PagesLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<>
			<NavigationMenuBar />
			<main className="w-full p-4 pb-0 flex flex-col flex-grow">{children}</main>
		</>
	);
}
