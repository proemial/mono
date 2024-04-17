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
import { ChatAnswerSkeleton, ChatPapersSkeleton } from "@/components/skeletons";
import { Header4 } from "@proemial/shadcn-ui";
import { File02 } from "@untitled-ui/icons-react";
import { Message } from "ai/react";
import { useThrobberStatus } from "./use-throbber-status";

type QaPairProps = {
	question: Message;
	answer: Message | undefined;
	data: AnswerEngineEvents[];
	loading: boolean;
};

export const QaPair = ({ question, answer, data, loading }: QaPairProps) => {
	const { papers } = findByEventType(data, "papers-fetched", question.id) ?? {};
	const isQuestionByCurrentUser = question.id !== SHARED_ANSWER_TRANSACTION_ID;
	const throbberStatus = useThrobberStatus();

	return (
		<div className="space-y-6">
			<ChatQuestion
				question={question.content}
				isQuestionByCurrentUser={isQuestionByCurrentUser}
			/>
			{!papers && loading && <ChatPapersSkeleton statusText={throbberStatus} />}
			{papers && (
				<CollapsibleSection
					trigger={
						<div className="flex items-center gap-4">
							<File02 className="size-4" />
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
							/>
						))}
					</HorisontalScrollArea>
				</CollapsibleSection>
			)}
			{loading && papers && <ChatAnswerSkeleton />}
			{answer && (
				<ChatArticle type="Answer" model="GPT-4-TURBO" text={answer.content} />
			)}
			{!loading && <ChatActionBarAsk />}
		</div>
	);
};
