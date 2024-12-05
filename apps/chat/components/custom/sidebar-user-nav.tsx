"use client";
import dynamic from "next/dynamic";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

const ThemeToggle = dynamic(() => import("./theme-toggle"), { ssr: false });

export function SidebarUserNav({ sessionId }: { sessionId: string }) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<ThemeToggle />
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
