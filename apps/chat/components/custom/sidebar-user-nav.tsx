"use client";
import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { type User } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
							<Image
								src={`https://avatar.vercel.sh/${sessionId}`}
								alt={sessionId ?? "User Avatar"}
								width={24}
								height={24}
								className="rounded-full"
							/>
							<span className="truncate">{sessionId}</span>
							<ChevronUp className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						side="top"
						className="w-[--radix-popper-anchor-width]"
					>
						<DropdownMenuItem
							className="cursor-pointer"
							onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
						>
							{`Toggle ${theme === "light" ? "dark" : "light"} mode`}
						</DropdownMenuItem>
						{/* <DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<>
								{user?.email && (
									<button
										type="button"
										className="w-full cursor-pointer"
										onClick={() => {
											signOut({
												redirectTo: "/",
											});
										}}
									>
										Sign out
									</button>
								)}
								{!user?.email && (
									<button
										type="button"
										className="w-full cursor-pointer"
										onClick={() => {
											signIn();
										}}
									>
										Log in
									</button>
								)}
							</>
						</DropdownMenuItem> */}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
