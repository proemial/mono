"use client";
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

export type PaperChatProps = Pick<
	ChatSuggestedFollowupsProps,
	"suggestions"
> & {
	title: string;
	abstract?: string;
};

export function PaperChat({ suggestions, title, abstract }: PaperChatProps) {
	const { messages, append } = useChat({
		body: { title, abstract },
		api: "/api/bot/chat",
	});

	const hasQA = messages.length > 0;

	const handleExplainerClick = (msg: string) => {
		append({ role: "user", content: `What is ${msg}?` });
	};

	return (
		<>
			{hasQA ? (
				<div className="flex flex-col gap-5">
					<div className="flex items-center place-content-between">
						<div className="flex items-center gap-4">
							<GanttChart />
							<Header4>Q&A</Header4>
						</div>
						{/* <SelectContentSelector
					selector={[
						{ value: "latest", label: "Latest" },
						{ value: "popular", label: "Popular" },
						{ value: "trending", label: "Trending" },
						{ value: "unanswered", label: "Unanswered" },
					]}
				/> */}
					</div>
					<div className="flex flex-col gap-6">
						{messages
							.filter((_, index) => index % 2 === 0)
							.map((message, index) => (
								<QAMessageContainer
									key={message.id}
									grow={[index * 2, index * 2 + 1].includes(
										messages.length - 1,
									)}
								>
									<QAMessage
										content={messages[index * 2]?.content}
										role="user"
										onExplainerClick={handleExplainerClick}
									/>
									<QAMessage
										content={messages[index * 2 + 1]?.content}
										role="assistant"
										onExplainerClick={handleExplainerClick}
									/>
								</QAMessageContainer>
							))}
					</div>
				</div>
			) : (
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
		</>
	);
}
