"use client";

import {
	AnswerEngineEvents,
	PapersFetched,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { ChatActionBarAsk } from "@/components/chat-action-bar-ask";
import { ChatArticle } from "@/components/chat-article";
import { ChatQuestion } from "@/components/chat-question";
import { CollapsibleSection } from "@/components/collapsible-section";
import { PaperCardAsk } from "@/components/paper-card-ask";
import { ChatAnswerSkeleton, ChatPapersSkeleton } from "@/components/skeletons";
import { Header4, ScrollArea, ScrollBar } from "@proemial/shadcn-ui";
import { Message, useChat } from "ai/react";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
	question: Message;
	answer: Message | undefined;
	data: ReturnType<typeof useChat>["data"];
	loading: boolean;
};

export const QaPair = ({ question, answer, data, loading }: Props) => {
	const [papers, setPapers] = useState<PapersFetched | undefined>(undefined);

	useEffect(() => {
		if (data) {
			const transactionId = question.id;
			const transactionData = data?.filter(
				(d) => (d as AnswerEngineEvents).transactionId === transactionId,
			) as AnswerEngineEvents[];
			const papers = findLatestByEventType(
				transactionData,
				"papers-fetched",
			)?.hits?.at(0)?.papers;
			setPapers(papers);
		}
	}, [data, question.id]);

	return (
		<div className="space-y-6">
			<ChatQuestion question={question.content} />
			{!papers && loading && (
				<ChatPapersSkeleton statusText="Searching research papers" />
			)}
			{papers && (
				<CollapsibleSection
					trigger={
						<div className="flex items-center gap-4">
							<FileText className="size-4" />
							<Header4>Research papers interrogated</Header4>
						</div>
					}
					extra={papers.length}
				>
					<ScrollArea className="w-full pb-4 rounded-md whitespace-nowrap">
						<div className="flex space-x-3 w-max">
							{papers.map((paper, index) => (
								<PaperCardAsk
									key={index}
									paper={paper}
									index={`${index + 1}`}
								/>
							))}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
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
