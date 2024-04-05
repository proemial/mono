"use client";

import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import { applyLinks } from "@/app/components/chat/apply-links";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import type { Message } from "ai/react";
import { ShareIcon } from "lucide-react";
import { SinglarThrobber, Throbber } from "../loading/throbber";
import {
	FeedbackButtons,
	type FeedbackButtonsProps,
} from "./feedback/feedback-buttons";

// TODO! Type as either a user message or a bot message
export type ChatMessageProps = Partial<FeedbackButtonsProps> & {
	message?: Message["content"];
	user?: {
		fullName: string;
		initials: string;
		avatar: string;
	};
	isLoading?: boolean;
	showThrobber?: boolean;
	onShareHandle?: (() => void) | null;
};

export function ChatMessage({
	message,
	user = { fullName: "you", initials: "U", avatar: "" },
	onShareHandle,
	runId,
	showThrobber,
}: ChatMessageProps) {
	const { content, links } = applyLinks(message ?? "");

	return (
		<div className="w-full mx-[-4px] my-2">
			<div className="flex justify-between gap-4">
				<div className="flex gap-3">
					<Avatar className="w-6 h-6">
						<AvatarImage src={user.avatar} />
						<AvatarFallback className="bg-gray-600">
							{user.initials}
						</AvatarFallback>
					</Avatar>
					<div className="font-bold">{user.fullName}</div>
				</div>

				<div className="flex items-end gap-3">
					<FeedbackButtons runId={runId} />

					{onShareHandle && (
						<ShareIcon
							onClick={() => {
								onShareHandle();
								Tracker.track(analyticsKeys.ask.click.share);
							}}
							className="ml-auto"
						/>
					)}
				</div>
			</div>

			<div className="mt-2 ml-9">
				<div>
					{message ? (
						content
					) : (
						<Throbber text="Searching scientific papers..." />
					)}
					{showThrobber && <SinglarThrobber />}
				</div>
			</div>
		</div>
	);
}
