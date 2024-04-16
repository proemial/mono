import "@/app/globals.css";
import { NavigationMenuBar } from "@/components/navigation-menu-bar";
import "@/env";
import { ReactNode } from "react";

export default function PagesLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<NavigationMenuBar />
			<main className="w-full">{children}</main>
		</>
	);
}
