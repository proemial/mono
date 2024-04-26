"use client";

import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
import { Tracker } from "@/app/components/analytics/tracking/tracker";
import {
	PaperCard,
	PaperCardTitle,
	PaperCardTop,
} from "@/app/components/card/paper-card";
import {
	applyLinks,
	applyLinksAsPills,
} from "@/app/components/chat/apply-links";
import { LinkButton } from "@/app/components/proem-ui/link-button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import type { Message } from "ai/react";
import { ChevronDown, ChevronUp, Upload01 } from "@untitled-ui/icons-react";
import {
	SinglarThrobber,
	Throbber as MessageThrobber,
} from "../loading/throbber";
import {
	FeedbackButtons,
	type FeedbackButtonsProps,
} from "./feedback/feedback-buttons";
import { useState } from "react";
import Link from "next/link";

// TODO! Type as either a user message or a bot message
export type ChatMessageProps = Partial<FeedbackButtonsProps> & {
	message?: Message["content"];
	user?: {
		fullName: string;
		initials: string;
		avatar: string;
	};
	isLoading?: boolean;
	throbber?: { message?: string };
	showLinkCards?: boolean;
	onShareHandle?: (() => void) | null;
	papers?: { link: string; title: string; published?: string }[];
};

export function ChatMessage({
	message,
	user = { fullName: "you", initials: "U", avatar: "" },
	onShareHandle,
	runId,
	throbber,
	showLinkCards,
	papers,
}: ChatMessageProps) {
	const showLinksAsPills = !showLinkCards;
	const { content, links } = showLinksAsPills
		? applyLinksAsPills(message ?? "")
		: applyLinks(message ?? "");

	return (
		<div className="w-full mx-[-4px] my-2">
			<Papers papers={papers} />

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
						<Upload01
							onClick={() => {
								onShareHandle();
								Tracker.track(`ask:${analyticsKeys.chat.click.share}`);
							}}
							className="ml-auto"
						/>
					)}
				</div>
			</div>

			<div className="mt-2 ml-9">
				<div>
					{message && content}
					<Throbber throbber={throbber} />
				</div>

				{showLinkCards && links.length > 0 && (
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

function Papers({
	papers,
}: { papers?: { link: string; title: string; published?: string }[] }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			{papers && (
				<div className="flex flex-col justify-center px-2 py-1 mt-4 mb-1 ml-8 border rounded-sm cursor-pointer">
					<div className="flex justify-between" onClick={() => setOpen(!open)}>
						<div>Papers</div>
						<div>
							{open && <ChevronUp />}
							{!open && <ChevronDown />}
						</div>
					</div>
					{open && papers && (
						<ul className="ml-4 list-disc">
							{papers.map((paper) => (
								<li key={paper.link}>
									<Link
										key={paper.link}
										href={paper.link}
										className="font-normal text-green-500"
									>
										{paper.title}
									</Link>
									<span className=" text-slate-500"> ({paper.published})</span>
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</>
	);
}

function Throbber({ throbber }: { throbber?: { message?: string } }) {
	return (
		<>
			{throbber?.message?.length !== undefined && (
				<MessageThrobber text={throbber.message} />
			)}
			{throbber && throbber.message === undefined && <SinglarThrobber />}
		</>
	);
}
