"use client";
import { useTheme } from "next-themes";
import { Toggle } from "@proemial/shadcn-ui/components/ui/toggle";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarUserNav({ sessionId }: { sessionId: string }) {
	const { setTheme, theme } = useTheme();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Toggle
					variant="outline"
					className="w-full"
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				>
					{`Toggle ${theme === "light" ? "dark" : "light"} mode`}
				</Toggle>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
