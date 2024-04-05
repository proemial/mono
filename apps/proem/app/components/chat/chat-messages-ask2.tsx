"use client";
import { STARTERS } from "@/app/(pages)/(app)/(answer-engine)/starters";
import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";
import { useChat, type Message } from "ai/react";
import { useEffect, useRef, type ReactNode } from "react";
import { PROEM_BOT } from "./bot-user";
import { ChatMessage } from "./chat-message-ask2";
import { useChatState } from "./state";

type Props = {
	message?: string;
	children?: ReactNode;
	initialMessages?: Message[];
	existingShareId?: string;
};

export function ChatMessages({
	message,
	children,
	initialMessages,
}: Props) {
	const { question, clearQuestion, setSuggestions } = useChatState("ask");
	const {
		messages,
		isLoading,
		append,
		setMessages,
		data,
	} = useChat({
		sendExtraMessageFields: true,
		id: "hardcoded",
		api: "/api/bot/ask2",
		initialMessages,
	});

	const messagesDiv = useScroll(messages);

	useRunOnFirstRender(() => {
		if (message) {
			setMessages([]);
			appendQuestion(message);
		} else if (!initialMessages?.length) {
			const starters = [...STARTERS]
				.sort(() => 0.5 - Math.random())
				.slice(0, 3);
			setSuggestions(starters);
		}
	});

	useEffect(() => {
		if (question) {
			appendQuestion(question);
			clearQuestion();
			setSuggestions([]);
		}
	}, [question, setSuggestions, clearQuestion]);

	const appendQuestion = (question: string) =>
		append({ role: "user", content: question });

	return (
		<>
			{messages?.length > 0 && (
				<div ref={messagesDiv} className="pb-32">
					{messages.map((message, i) => {
						const isMessageFromAI = message.role === "assistant";
						const isLastMessage = i === messages.length - 1;
						// Prevent settings prior messages in a conversation to a loading state while we wait for the AI to respond
						const isLastMessageAndLoading = isLastMessage ? isLoading : false;

						return (
							<ChatMessage
								key={message.id}
								message={message.content}
								user={isMessageFromAI ? PROEM_BOT : undefined}
								isLoading={isLastMessageAndLoading}
								showThrobber={isMessageFromAI && isLoading && isLastMessage}
								showLinkCards={false}
							/>
						);
					})}

					{isLoading && <ChatMessage user={PROEM_BOT} />}
				</div>
			)}
			{messages.length === 0 && children}
		</>
	);
}

function useScroll(messages: Message[]) {
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

	return messagesDiv;
}
