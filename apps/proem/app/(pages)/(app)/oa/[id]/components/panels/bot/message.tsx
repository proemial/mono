"use client";

import { applyExplainLinks } from "@/app/components/chat/apply-links";
import { Send } from "@/app/components/icons/functional/send";
import { useDrawerState } from "@/app/components/login/state";
import { useAuth } from "@clerk/nextjs";

type Role = "function" | "data" | "system" | "user" | "assistant" | "tool";

type Props = {
	role: Role;
	content: string;
	explain: (msg: string) => void;
};

export function Message({ role, content, explain }: Props) {
	const withLinks = applyExplainLinks(content, explain);
	if (role === "user") {
		return <Question>{content}</Question>;
	} else {
		return <Answer>{withLinks}</Answer>;
	}
}

const style = "inline-block";

export function Answer({ children }: { children: React.ReactNode }) {
	return (
		<div
			className={`${style} bg-[#464545] max-w-md leading-snug mb-2 py-2 px-4 text-[16px] font-normal rounded-sm self-start`}
		>
			{children}
		</div>
	);
}

type QuestionProps = {
	children: string;
	onClick?: () => void;
	className?: string;
	starter?: boolean;
};

export function Question({ children, onClick, starter }: QuestionProps) {
	const { userId } = useAuth();
	const { open } = useDrawerState();

	const handleClick = () => {
		if (!userId) {
			open();
			return;
		}
		onClick && onClick();
	};

	return (
		<div
			className="flex justify-between gap-3 mb-2 p-2 border rounded-sm border-[#4E4E4E] bg-[#2F2F2F] leading-5 text-[16px] font-normal"
			onClick={handleClick}
		>
			{children}
			{starter && (
				<div className="flex items-center ml-2 mr-1">
					<Send />
				</div>
			)}
		</div>
	);
}
