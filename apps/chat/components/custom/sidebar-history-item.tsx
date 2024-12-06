"use client";

import Link from "next/link";

import { MoreHorizontalIcon, TrashIcon } from "@/components/custom/icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Chat } from "@/db/schema";
import { useRouter } from "next/navigation";

export const HistoryItem = ({
	chat,
	isActive,
	onDelete,
	sidebarOpenOnMobile,
}: {
	chat: Chat;
	isActive: boolean;
	onDelete: (chatId: string) => void;
	sidebarOpenOnMobile: (open: boolean) => void;
}) => {
	const router = useRouter();

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={isActive}>
				<div
					className="cursor-pointer"
					onClick={() => {
						sidebarOpenOnMobile(false);
						router.push(`/chat/${chat.id}`);
					}}
				>
					<span>{chat.title}</span>
				</div>
			</SidebarMenuButton>
			<DropdownMenu modal={true}>
				<DropdownMenuTrigger asChild>
					<SidebarMenuAction
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
						showOnHover={!isActive}
					>
						<MoreHorizontalIcon />
						<span className="sr-only">More</span>
					</SidebarMenuAction>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="bottom" align="end">
					<DropdownMenuItem
						className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
						onSelect={() => onDelete(chat.id)}
					>
						<TrashIcon />
						<span>Delete</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
};
