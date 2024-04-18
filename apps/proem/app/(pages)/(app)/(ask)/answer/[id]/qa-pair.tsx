"use client";

import { SHARED_ANSWER_TRANSACTION_ID } from "@/app/(pages)/(app)/share/constants";
import {
	AnswerEngineEvents,
	findByEventType,
} from "@/app/api/bot/answer-engine/events";
import { ChatActionBarAsk } from "@/components/chat-action-bar-ask";
import { ChatArticle } from "@/components/chat-article";
import { ChatQuestion } from "@/components/chat-question";
import { CollapsibleSection } from "@/components/collapsible-section";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { PaperCardAsk } from "@/components/paper-card-ask";
import { ChatPapersSkeleton } from "@/components/skeletons";
import { Header4 } from "@proemial/shadcn-ui";
import { File02 } from "@untitled-ui/icons-react";
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
	const isLoadingAnswer = !findByEventType(data, "answer-saved", question.id);
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
				isLatest && "min-h-[calc(100vh-160px)]"
			}`}
		>
			<div className="space-y-6">
				<ChatQuestion
					question={question.content}
					isQuestionByCurrentUser={isQuestionByCurrentUser}
				/>
				{!papers && isLoadingAnswer && !answer && (
					<ChatPapersSkeleton statusText={throbberStatus} />
				)}
				{papers && (
					<CollapsibleSection
						trigger={
							<div className="flex items-center gap-4">
								<File02 className="size-4" />
								<Header4>Research papers evaluated</Header4>
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
					<div className="space-y-2">
						<ChatArticle
							type="Answer"
							model="GPT-4-TURBO"
							text={answer.content}
						/>
						{!isLoadingAnswer && <ChatActionBarAsk />}
					</div>
				)}
			</div>
			{isLatest && !isLoadingAnswer && followUps}
		</div>
	);
};
