"use client";
import { ChatInput } from "@/components/chat-input";
import {
	ChatSuggestedFollowups,
	ChatSuggestedFollowupsProps,
} from "@/components/chat-suggested-followups";
import { QAMessage } from "@/components/qa-message";
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
					<div className="flex flex-col gap-6 place-items-end">
						{messages.map((message) => (
							<QAMessage
								key={message.id}
								content={message.content.replaceAll("((", "").replaceAll("))", "")}
								role={message.role}
							/>
						))}
					</div>
				</div>
			) : (
				<ChatSuggestedFollowups suggestions={suggestions} onClick={append} />
			)}

			<ChatInput placeholder="Ask this paper .." onSend={append} />
		</>
	);
}
