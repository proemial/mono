import { Message } from "ai";
import { ReactNode, useEffect, useRef } from "react";
import { ChatMessage, ChatMessageProps } from "./chat-message-ask";
import { FeedbackButtonsProps } from "./feedback/feedback-buttons";

const PROEM_BOT = {
	name: "proem",
	initials: "P",
	avatar: "/android-chrome-512x512.png",
};

type Props = Required<Pick<ChatMessageProps, "onShareHandle" | "isLoading">> &
	Pick<ChatMessageProps, "user"> & {
		messages: Message[];
		showLoadingState: boolean;
		children?: ReactNode;
	} & {
		runIds: FeedbackButtonsProps["runId"][];
	};

export function ChatMessages(props: Props) {
	const {
		messages,
		user,
		onShareHandle,
		isLoading,
		showLoadingState,
		children,
		runIds,
	} = props;

	const messagesDiv = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (messagesDiv.current && messages) {
			messagesDiv.current.scrollIntoView({
				behavior: "smooth",
				block: "end",
				inline: "nearest",
			});
		}
	}, [messages]);

	// There is a run ID for each answer, so we need to match the run ID to the answer
	const getAnswerRunId = (role: Message["role"], index: number) =>
		role === "assistant" ? runIds[Math.floor(index / 2)] : undefined;

	return (
		<>
			{messages?.length > 0 && (
				<div ref={messagesDiv} className="pb-32">
					{messages.map((m, i) => (
						<ChatMessage
							key={i}
							message={m.content}
							user={m.role === "assistant" ? PROEM_BOT : user}
							onShareHandle={m.role === "assistant" ? onShareHandle : null}
							runId={getAnswerRunId(m.role, i)}
							isLoading={isLoading}
							showThrobber={
								m.role === "assistant" && isLoading && i === messages.length - 1
							}
						/>
					))}
					{showLoadingState && <ChatMessage user={PROEM_BOT} />}
				</div>
			)}
			{messages.length === 0 && children}
		</>
	);
}
