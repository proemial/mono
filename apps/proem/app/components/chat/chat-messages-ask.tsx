import { Message } from "ai";
import { ChatMessage, ChatMessageProps } from "./chat-message-ask";
import { ReactNode, useEffect, useRef } from "react";

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
	};

export function ChatMessages(props: Props) {
	const { messages, user, onShareHandle, isLoading, showLoadingState, children } = props;

	const messagesDiv = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (messagesDiv.current && messages) {
			messagesDiv.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
		}
	}, [messages]);

	return (
		<>
			{messages?.length > 0 &&
				<div ref={messagesDiv} className="pb-32">
					{messages.map((m, i) => (
						<ChatMessage
							key={i}
							message={m.content}
							user={m.role === "assistant" ? PROEM_BOT : user}
							onShareHandle={m.role === "assistant" ? onShareHandle : null}
							isLoading={isLoading}
							showThrobber={
								m.role === "assistant" && isLoading && i === messages.length - 1
							}
						/>
					))}
					{showLoadingState && <ChatMessage user={PROEM_BOT} />}

				</div>
			}
			{messages.length === 0 && children}
		</>
	);
}
