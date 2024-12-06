"use client";

import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	useSidebar,
} from "@/components/ui/sidebar";
import { Chat } from "@/db/schema";
import { useMutation, useQuery } from "@tanstack/react-query";

import { HistoryItem } from "./sidebar-history-item";

type GroupedChats = {
	today: Chat[];
	yesterday: Chat[];
	lastWeek: Chat[];
	lastMonth: Chat[];
	older: Chat[];
};

export function SidebarHistory({ sessionId }: { sessionId: string }) {
	const { setOpenMobile: sidebarOpenOnMobile } = useSidebar();
	const { id } = useParams();

	const { data: history, isLoading } = useQuery({
		queryKey: ["history"],
		queryFn: () => fetch("/api/history").then((res) => res.json()),
	});
	const mutation = useMutation({
		mutationFn: () =>
			fetch(`/api/chat?id=${deleteId}`, { method: "DELETE" }).then((res) =>
				res.json(),
			),
		onSuccess: (queryClient) => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["history"] });
		},
	});

	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const router = useRouter();

	const handleDelete = () => {
		mutation.mutate();
		setShowDeleteDialog(false);

		if (deleteId === id) {
			router.push("/");
		}
	};

	if (!sessionId) {
		return (
			<SidebarGroup>
				<SidebarGroupContent>
					<div className="text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
						<div>Login to save and revisit previous chats!</div>
					</div>
				</SidebarGroupContent>
			</SidebarGroup>
		);
	}

	if (isLoading) {
		return (
			<SidebarGroup>
				<div className="px-2 py-1 text-xs text-sidebar-foreground/50">
					Today
				</div>
				<SidebarGroupContent>
					<div className="flex flex-col">
						{[44, 32, 28, 64, 52].map((item) => (
							<div
								key={item}
								className="rounded-md h-8 flex gap-2 px-2 items-center"
							>
								<div
									className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
									style={
										{
											"--skeleton-width": `${item}%`,
										} as React.CSSProperties
									}
								/>
							</div>
						))}
					</div>
				</SidebarGroupContent>
			</SidebarGroup>
		);
	}

	if (history?.length === 0) {
		return (
			<SidebarGroup>
				<SidebarGroupContent>
					<div className="text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
						<div>
							Your conversations will appear here once you start chatting!
						</div>
					</div>
				</SidebarGroupContent>
			</SidebarGroup>
		);
	}

	const groupChatsByDate = (chats: Chat[]): GroupedChats => {
		const now = new Date();
		const oneWeekAgo = subWeeks(now, 1);
		const oneMonthAgo = subMonths(now, 1);

		return chats.reduce(
			(groups, chat) => {
				const chatDate = new Date(chat.createdAt);

				if (isToday(chatDate)) {
					groups.today.push(chat);
				} else if (isYesterday(chatDate)) {
					groups.yesterday.push(chat);
				} else if (chatDate > oneWeekAgo) {
					groups.lastWeek.push(chat);
				} else if (chatDate > oneMonthAgo) {
					groups.lastMonth.push(chat);
				} else {
					groups.older.push(chat);
				}

				return groups;
			},
			{
				today: [],
				yesterday: [],
				lastWeek: [],
				lastMonth: [],
				older: [],
			} as GroupedChats,
		);
	};

	return (
		<>
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						<HistoryList
							groupedChats={groupChatsByDate(history)}
							id={id}
							setDeleteId={setDeleteId}
							setShowDeleteDialog={setShowDeleteDialog}
							sidebarOpenOnMobile={sidebarOpenOnMobile}
						/>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>

			<Alert
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				handleDelete={handleDelete}
			/>
		</>
	);
}

function HistoryList({
	groupedChats,
	id,
	setDeleteId,
	setShowDeleteDialog,
	sidebarOpenOnMobile,
}: {
	groupedChats: GroupedChats;
	id: string | string[] | undefined;
	setDeleteId: (id: string) => void;
	setShowDeleteDialog: (open: boolean) => void;
	sidebarOpenOnMobile: (open: boolean) => void;
}) {
	const History = ({ group, title }: { group: Chat[]; title: string }) => (
		<>
			{group.length > 0 && (
				<div>
					<div className="px-2 py-1 text-xs text-sidebar-foreground/50">
						{title}
					</div>
					{group.map((chat) => (
						<HistoryItem
							key={chat.id}
							chat={chat}
							isActive={chat.id === id}
							onDelete={(chatId) => {
								setDeleteId(chatId);
								setShowDeleteDialog(true);
							}}
							sidebarOpenOnMobile={sidebarOpenOnMobile}
						/>
					))}
				</div>
			)}
		</>
	);

	return (
		<>
			{history &&
				(() => {
					return (
						<div className="flex flex-col gap-6">
							<History group={groupedChats.today} title="Today" />

							<History group={groupedChats.yesterday} title="Yesterday" />

							<History group={groupedChats.lastWeek} title="Last 7 days" />

							<History group={groupedChats.lastMonth} title="Last 30 days" />

							<History group={groupedChats.older} title="Older" />
						</div>
					);
				})()}
		</>
	);
}

function Alert({
	open,
	onOpenChange,
	handleDelete,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	handleDelete: () => void;
}) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your chat
						and remove it from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
