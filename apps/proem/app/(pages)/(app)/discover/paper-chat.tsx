"use client";
import {
	AnswerEngineEvents,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { ChatInput } from "@/components/chat-input";
import {
	ChatSuggestedFollowups,
	ChatSuggestedFollowupsProps,
} from "@/components/chat-suggested-followups";
import { QAMessage } from "@/components/qa-message";
import { QAMessageContainer } from "@/components/qa-message-container";
import { Header4 } from "@proemial/shadcn-ui";
import { useChat } from "ai/react";
import { GanttChart } from "lucide-react";
import { MessageWithAuthorUserData } from "../paper/paper-post-utils";

type PaperChatProps = Pick<ChatSuggestedFollowupsProps, "suggestions"> & {
	title: string;
	paperId: string;
	initialMessages: MessageWithAuthorUserData[];
	abstract?: string;
};

export function PaperChat({
	suggestions,
	title,
	paperId,
	initialMessages,
	abstract,
}: PaperChatProps) {
	const { messages, append, data, isLoading } = useChat({
		body: { title, abstract, paperId },
		api: "/api/bot/chat",
		initialMessages,
	});

	const handleExplainerClick = (msg: string) => {
		append({ role: "user", content: `What is ${msg}?` });
		trackHandler(analyticsKeys.read.click.explainer)();
	};

	const followUps = getFollowUps(data as AnswerEngineEvents[]);

	return (
		<div className="space-y-5">
			<div className="flex flex-col gap-5 justify-between">
				{messages.length > 0 && (
					<div className="flex items-center place-content-between">
						<div className="flex items-center gap-3.5">
							<GanttChart />
							<Header4>Q&A</Header4>
						</div>
					</div>
				)}
				<div className="flex flex-col gap-6">
					{messages
						.filter((_, index) => index % 2 === 0)
						.map((message, index) => (
							<QAMessageContainer
								key={message.id}
								grow={[index * 2, index * 2 + 1].includes(messages.length - 1)}
								enabled={initialMessages.length !== messages.length}
							>
								<div className="flex flex-col gap-6 place-items-end">
									<QAMessage
										message={messages[index * 2]}
										onExplainerClick={handleExplainerClick}
									/>
									<QAMessage
										message={messages[index * 2 + 1]}
										onExplainerClick={handleExplainerClick}
									/>
								</div>
								{followUps.length > 0 &&
									index === messages.length / 2 - 1 &&
									!isLoading && (
										<ChatSuggestedFollowups
											suggestions={followUps}
											onClick={append}
											trackingPrefix="read"
										/>
									)}
							</QAMessageContainer>
						))}
				</div>
			</div>
			{followUps.length === 0 && !isLoading && (
				<ChatSuggestedFollowups
					suggestions={suggestions}
					onClick={append}
					trackingPrefix="read"
				/>
			)}
			<ChatInput
				placeholder="Ask this paper .."
				onSend={append}
				trackingPrefix="read"
			/>
		</div>
	);
}

const getFollowUps = (data: AnswerEngineEvents[]) =>
	findLatestByEventType(data, "follow-up-questions-generated")
		.hits.at(0)
		?.map((hit) => hit.question) ?? [];
