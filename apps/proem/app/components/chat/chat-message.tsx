"use client";
import { Send } from "@/app/components/icons/functional/send";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { useAuth } from "@clerk/nextjs";
import { Message } from "ai";
import { useDrawerState } from "../login/state";
import { applyExplainLinks } from "../../../components/chat-apply-links";

type Props = {
	message?: Pick<Message, "role" | "content">;
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
				onExplainerClick ?? (() => {}),
			);

	return (
		<div className="w-full mb-2">
			<div className="flex gap-3">
				<Avatar className="w-6 h-6">
					<AvatarImage src={user?.avatar} />
					<AvatarFallback className="bg-gray-600">
						{user?.initials}
					</AvatarFallback>
				</Avatar>
				<div className="font-bold">{user?.fullName}</div>
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
