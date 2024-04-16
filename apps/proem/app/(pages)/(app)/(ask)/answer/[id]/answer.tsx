"use client";

import {
	AnswerEngineEvents,
	findByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useUser } from "@/app/hooks/use-user";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { ChatActionBarAsk } from "@/components/chat-action-bar-ask";
import { ChatArticle } from "@/components/chat-article";
import { ChatQuestion } from "@/components/chat-question";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { CollapsibleSection } from "@/components/collapsible-section";
import { PaperCardAsk } from "@/components/paper-card-ask";
import { ChatAnswerSkeleton } from "@/components/skeletons";
import { Header4, ScrollArea, ScrollBar } from "@proemial/shadcn-ui";
import { useChat } from "ai/react";
import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFollowUps } from "./use-follow-ups";
import { usePapers } from "./use-papers";

type Props = {
	question: string;
};

export const Answer = ({ question }: Props) => {
	const [sessionSlug, setSessionSlug] = useState<string | undefined>(undefined);
	const { user } = useUser();
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		data,
		append,
		isLoading,
	} = useChat({
		sendExtraMessageFields: true,
		id: "hardcoded",
		api: "/api/bot/ask2",
		body: { slug: sessionSlug, userId: user?.id },
	});

	const hasExecutedOnce = useRef(false);
	useEffect(() => {
		if (question && !hasExecutedOnce.current) {
			hasExecutedOnce.current = true;
			append({ role: "user", content: question });
		}
	}, [question, append]);

	const answer = messages
		.filter((m) => m.role === "assistant")
		.slice(-1)[0]?.content;

	const answerSlug = findByEventType(
		data as AnswerEngineEvents[],
		"answer-slug-generated",
	)?.slug;
	useEffect(() => {
		if (answerSlug) {
			setSessionSlug(answerSlug);
		}
	});

	const papers = usePapers({
		data,
		fallback: Array(5).fill(undefined),
	});
	const followUps = useFollowUps(data);

	return (
		<div className="space-y-6">
			<ChatQuestion question={question} />
			<CollapsibleSection
				trigger={
					<div className="flex items-center gap-4">
						<FileText className="size-4" />
						<Header4>
							{isLoading
								? "Searching for research papers"
								: "Research papers interrogated"}
						</Header4>
					</div>
				}
				extra={papers.length}
			>
				<ScrollArea className="w-full pb-4 rounded-md whitespace-nowrap">
					<div className="flex space-x-3 w-max">
						{papers.map((paper, index) => (
							<PaperCardAsk key={index} paper={paper} index={`${index + 1}`} />
						))}
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</CollapsibleSection>
			{isLoading && <ChatAnswerSkeleton />}
			<ChatArticle
				type="Answer"
				model={answer ? "GPT-4-TURBO" : ""}
				text={answer}
			/>
			{!isLoading && (
				<>
					<ChatActionBarAsk />
					<ChatSuggestedFollowups suggestions={followUps} />
					<ButtonScrollToBottom />
				</>
			)}
		</div>
	);
};
