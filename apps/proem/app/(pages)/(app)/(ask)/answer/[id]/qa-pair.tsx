"use client";

import { SHARED_ANSWER_TRANSACTION_ID } from "@/app/(pages)/(app)/share/constants";
import {
	AnswerEngineEvents,
	findByEventType,
} from "@/app/api/bot/answer-engine/events";
import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
import { ChatActionBarAsk } from "@/components/chat-action-bar-ask";
import { ChatArticle } from "@/components/chat-article";
import { ChatQuestion } from "@/components/chat-question";
import { CollapsibleSection } from "@/components/collapsible-section";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { Paper } from "@/components/icons/Paper";
import { PaperCardAsk } from "@/components/paper-card-ask";
import { Header4, Icons } from "@proemial/shadcn-ui";
import { Message } from "ai/react";
import { ReactNode, useEffect, useRef } from "react";
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

	useEffect(() => {
		if (pairRef.current) {
			pairRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, []);

	return (
		<div
			ref={pairRef}
			className={`flex flex-col justify-between gap-4 ${
				isLatest && "min-h-[calc(100dvh-172px)]"
			}`}
		>
			<div className="space-y-6">
				<ChatQuestion
					question={question.content}
					isQuestionByCurrentUser={isQuestionByCurrentUser}
				/>
				{!papers && isLoadingAnswer && !answer && (
					<div className="flex items-center gap-4 min-h-9">
						<Paper />
						<Header4>{throbberStatus}</Header4>
						<div className="flex flex-grow justify-end">
							<Icons.throbber />
						</div>
					</div>
				)}
				{papers && papers.length === 0 && (
					<div className="flex items-center gap-4">
						<Paper />
						<Header4>No research papers found</Header4>
					</div>
				)}
				{papers && papers.length > 0 && (
					<CollapsibleSection
						trackingKey={analyticsKeys.ask.click.collapse}
						trigger={
							<div className="flex items-center gap-4">
								<Paper />
								<Header4>Research papers interrogated</Header4>
							</div>
						}
						extra={papers?.length}
					>
						<HorisontalScrollArea>
							{papers?.map((paper, index) => (
								<PaperCardAsk
									key={index}
									date={paper?.published}
									title={paper?.title}
									loading={!paper}
									index={`${index + 1}`}
									link={`/discover/${paper.link.replace("/oa/", "")}`}
								/>
							))}
						</HorisontalScrollArea>
					</CollapsibleSection>
				)}
				{/* {isLoadingAnswer && papers && <ChatAnswerSkeleton /> // Relevant once we generate micro titles} */}
				{answer && (
					<div className="space-y-4">
						<ChatArticle
							type="Answer"
							model="GPT-4-TURBO"
							text={answer.content}
							trackingKey={analyticsKeys.ask.click.model}
						/>
						{savedAnswer?.shareId && (
							<ChatActionBarAsk shareId={savedAnswer.shareId} />
						)}
					</div>
				)}
			</div>
			{isLatest && !isLoadingAnswer && followUps}
		</div>
	);
};
