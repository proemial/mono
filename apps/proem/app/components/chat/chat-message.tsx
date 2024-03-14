"use client";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";

import { Send } from "@/app/components/icons/functional/send";
import { useAuth } from "@clerk/nextjs";
import { useDrawerState } from "../login/state";
import { applyExplainLinks } from "./apply-links";

type Role = "function" | "data" | "system" | "user" | "assistant" | "tool";

type Props = {
	message?: { role: Role; content: string };
	user?: {
		fullName: string;
		initials: string;
		avatar: string;
	};
	showThrobber?: boolean;
	onExplainerClick?: (msg: string) => void;
};

export function ChatMessage(props: Props) {
	const { message, user, onExplainerClick, showThrobber } = props;

	const isUser = message?.role === "user";

	const text = isUser
		? message.content
		: applyExplainLinks(
			message?.content as string,
			onExplainerClick ?? (() => { }),
		);

	const speaker = isUser
		? user
		: {
			fullName: "proem",
			initials: "P",
			avatar: "/android-chrome-512x512.png",
		};

	return (
		<div className="w-full mb-2">
			<div className="flex gap-3">
				<Avatar className="w-6 h-6">
					<AvatarImage src={speaker?.avatar} />
					<AvatarFallback className="bg-gray-600">
						{user?.initials}
					</AvatarFallback>
				</Avatar>
				<div className="font-bold">{speaker?.fullName}</div>
			</div>

			<div className="mt-2 ml-9">{text}</div>
		</div>
	);
}

type StarterProps = {
	children: string;
	requiresAuth?: boolean;
	onClick?: () => void;
};

export function ChatStarter({ children, requiresAuth, onClick }: StarterProps) {
	const { userId } = useAuth();
	const { open } = useDrawerState();

	const handleClick = () => {
		if (requiresAuth && !userId) {
			open();
			return;
		}
		!!onClick && onClick();
	};

	return (
		<div
			className="flex justify-between gap-3 mb-2 p-2 border rounded-sm border-[#4E4E4E] bg-[#2F2F2F] leading-5 text-[16px] font-normal cursor-pointer"
			onClick={handleClick}
		>
			{children}
			<div className="flex items-center ml-2 mr-1">
				<Send />
			</div>
		</div>
	);
}
