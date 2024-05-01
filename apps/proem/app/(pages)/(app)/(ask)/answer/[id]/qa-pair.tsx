"use client";

import { SHARED_ANSWER_TRANSACTION_ID } from "@/app/(pages)/(app)/share/constants";
import {
	AnswerEngineEvents,
	findByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { ChatActionBarAsk } from "@/components/chat-action-bar-ask";
import { ChatArticle } from "@/components/chat-article";
import { ChatQuestion } from "@/components/chat-question";
import { CollapsibleSection } from "@/components/collapsible-section";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { Paper } from "@/components/icons/Paper";
import { PaperCardAsk } from "@/components/paper-card-ask";
import { Header4, Icons, cn } from "@proemial/shadcn-ui";
import { Message } from "ai/react";
import Link from "next/link";
import { ReactNode, useRef } from "react";
import { useThrobberStatus } from "./use-throbber-status";

type QaPairProps = {
	question: Message;
	answer: Message | undefined;
	data: AnswerEngineEvents[];
	followUps: ReactNode;
	isLatest: boolean;
};

export const QaPair = ({
	question,
	answer,
	data,
	followUps,
	isLatest,
}: QaPairProps) => {
	const isQuestionByCurrentUser = question.id !== SHARED_ANSWER_TRANSACTION_ID;
	const { papers } = findByEventType(data, "papers-fetched", question.id) ?? {};
	const savedAnswer = findByEventType(data, "answer-saved", question.id);
	const isLoadingAnswer = !savedAnswer;
	const throbberStatus = useThrobberStatus();
	const pairRef = useRef<HTMLDivElement>(null);

	useRunOnFirstRender(() => {
		// Only scroll to the latest QaPair if the answer is loading to prevent shared answers from scrolling
		if (pairRef.current && isLoadingAnswer) {
			pairRef.current.scrollIntoView({ behavior: "smooth" });
		}
	});

	return (
		<div
			ref={pairRef}
			className={cn("flex flex-col justify-between gap-6", {
				// Magic number pulled from a alternative dimension. Cannot be questioned but should probably be adjusted if vertical scroll is broken.
				"min-h-[calc(100dvh-204px)]": isLatest,
			})}
		>
			<div className="space-y-6">
				<ChatQuestion
					question={question.content}
					isQuestionByCurrentUser={isQuestionByCurrentUser}
				/>
				{!papers && isLoadingAnswer && !answer && (
					<div className="flex items-center gap-3.5 min-h-9">
						<Paper />
						<Header4>{throbberStatus}</Header4>
						<div className="flex justify-end flex-grow">
							<Icons.throbber />
						</div>
					</div>
				)}
				{papers && papers.length === 0 && (
					<div className="flex items-center gap-3.5">
						<Paper />
						<Header4>No research papers found</Header4>
					</div>
				)}
				{papers && papers.length > 0 && (
					<CollapsibleSection
						trackingKey={analyticsKeys.ask.click.collapse}
						trigger={
							<div className="flex items-center gap-3.5">
								<Paper />
								<Header4>Research papers interrogated</Header4>
							</div>
						}
						extra={papers?.length}
					>
						<HorisontalScrollArea>
							{papers?.map((paper, index) => (
								<Link
									key={index}
									href={`/discover/${paper.link.replace("/oa/", "")}`}
									onClick={trackHandler(analyticsKeys.ask.click.paper)}
								>
									<PaperCardAsk
										date={paper?.published}
										title={paper?.title}
										loading={!paper}
										index={`${index + 1}`}
									/>
								</Link>
							))}
						</HorisontalScrollArea>
					</CollapsibleSection>
				)}
				{/* {isLoadingAnswer && papers && <ChatAnswerSkeleton /> // Relevant once we generate micro titles} */}
				{answer && (
					<div>
						<ChatArticle
							type="Answer"
							text={answer.content}
							trackingKey={analyticsKeys.ask.click.model}
						/>
						{savedAnswer?.shareId && (
							<ChatActionBarAsk
								shareId={savedAnswer.shareId}
								trackingPrefix="ask"
							/>
						)}
					</div>
				)}
			</div>
			{isLatest && !isLoadingAnswer && followUps}
		</div>
	);
};
