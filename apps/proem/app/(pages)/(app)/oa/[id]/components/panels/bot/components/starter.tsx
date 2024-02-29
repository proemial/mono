"use client";

import { useDrawerState } from "@/app/components/login/state";
import { useAuth } from "@clerk/nextjs";
import { Send } from "lucide-react";

type QuestionProps = {
	children: string;
	onClick?: () => void;
	className?: string;
};

export function Starter({ children, onClick }: QuestionProps) {
	const { userId } = useAuth();
	const { open } = useDrawerState();

	const handleClick = () => {
		if (!userId) {
			open();
			return;
		}
		!!onClick && onClick();
	};

	return (
		<div
			className="flex justify-between gap-3 mb-2 p-2 border rounded-sm border-[#4E4E4E] bg-[#2F2F2F] leading-5 text-[16px] font-normal"
			onClick={handleClick}
		>
			{children}
			<div className="flex items-center ml-2 mr-1">
				<Send />
			</div>
		</div>
	);
}
