"use client";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import {
	PaperCard,
	PaperCardTitle,
	PaperCardTop,
} from "@/app/components/card/paper-card";
import { LinkButton } from "@/app/components/proem-ui/link-button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { ShareIcon } from "lucide-react";

import { applyExplainLinks } from "@/app/components/bot/apply-links";

type Role = "function" | "data" | "system" | "user" | "assistant" | "tool";

type Props = {
	message: { role: Role; content: string };
	user?: {
		fullName: string;
		initials: string;
		avatar: string;
	};
	onExplainerClick: (msg: string) => void;
};

export function Message({ message, user, onExplainerClick: onClick }: Props) {
	const isUser = message.role === "user";

	const text = isUser
		? message.content
		: applyExplainLinks(message.content as string, onClick ?? (() => {}));

	const speaker = isUser
		? user
		: {
				fullName: "proem",
				initials: "P",
				avatar: "/android-chrome-512x512.png",
		  };

	return (
		<div className="w-full">
			<div className="flex gap-3">
				<Avatar className="w-6 h-6">
					<AvatarImage src={speaker?.avatar} />
					<AvatarFallback className="bg-gray-600">
						{user.initials}
					</AvatarFallback>
				</Avatar>
				<div className="font-bold">{speaker?.fullName}</div>
			</div>

			<div className="mt-2 ml-9">{text}</div>
		</div>
	);
}
