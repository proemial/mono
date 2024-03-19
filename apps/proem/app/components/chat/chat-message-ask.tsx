"use client";

import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import {
	PaperCard,
	PaperCardTitle,
	PaperCardTop,
} from "@/app/components/card/paper-card";
import { applyLinks } from "@/app/components/chat/apply-links";
import { LinkButton } from "@/app/components/proem-ui/link-button";
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

type TransactionId = string;
type OnShareHandle = (transactionId: TransactionId) => void;

// TODO! Type as either a user message or a bot message
export type ChatMessageProps = Partial<FeedbackButtonsProps> & {
	message?: Message["content"];
	/** Each transactionId corrolates to the messageId of the question in an question/answer pair */
	transactionId?: TransactionId;
	user?: {
		fullName: string;
		initials: string;
		avatar: string;
	};
	isLoading?: boolean;
	showThrobber?: boolean;
	onShareHandle?: OnShareHandle | null;
};

export function ChatMessage({
	message,
	transactionId,
	user = { fullName: "you", initials: "U", avatar: "" },
	onShareHandle,
	runId,
	isLoading,
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
					{onShareHandle && transactionId && !isLoading && (
						<ShareIcon
							onClick={() => {
								onShareHandle(transactionId);
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

				{links.length > 0 && (
					<div className="pt-3 mt-3 space-y-3 border-t border-[#3C3C3C]">
						{links.map((link) => (
							<PaperCard
								key={link.href}
								className="pb-3 pt-1 border-0 rounded-lg bg-[#3C3C3C]"
							>
								{/* TODO: add date */}
								<PaperCardTop />

								<PaperCardTitle>{link.title}</PaperCardTitle>

								<LinkButton
									href={link.href}
									className="py-[1px] mt-2 no-underline"
									track={analyticsKeys.ask.click.answerCard}
								>
									Learn more...
								</LinkButton>
							</PaperCard>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
