"use client";
import { getProfileFromUser } from "@/app/(pages)/(app)/profile/profile-from-user";
import { Tracker } from "@/app//components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { PROEM_BOT } from "@/app/components/chat/bot-user";
import { useUser } from "@clerk/nextjs";
import { Message, useChat } from "ai/react";
import { ReactNode, useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import { useChatState } from "./state";

type Props = {
	title: string;
	abstract: string;
	starters: string[];
	children?: ReactNode;
};

export function ChatMessages({ title, abstract, starters, children }: Props) {
	const { messages, append, isLoading } = useChat({
		body: { title, abstract, model: "gpt-3.5-turbo" },
		api: "/api/bot/chat",
	});

	const { user } = useUser();
	const userProfile = getProfileFromUser(user);

	const { question, setLoading, setSuggestions, clearQuestion } =
		useChatState("paper");

	const chatWrapperRef = useScroll(messages);

	useEffect(() => {
		setSuggestions(starters);
	}, [starters, setSuggestions]);

	useEffect(() => {
		if (setLoading) {
			setLoading(isLoading);
		}
	}, [isLoading, setLoading]);

	useEffect(() => {
		if (question) {
			appendQuestion(question);
			clearQuestion();
		}
	}, [question, clearQuestion]);

	const appendQuestion = (question: string) =>
		append({ role: "user", content: question });

	const handleExplainerClick = (msg: string) => {
		Tracker.track(analyticsKeys.read.click.explainer, { msg });
		appendQuestion(`What is ${msg}?`);
	};

	return (
		<div ref={chatWrapperRef} className="px-4 pb-32">
			{messages?.map((message) => {
				const isMessageFromAI = message.role === "assistant";
				return (
					<ChatMessage
						key={message.id}
						message={message}
						user={isMessageFromAI ? PROEM_BOT : userProfile}
						onExplainerClick={handleExplainerClick}
					/>
				);
			})}
			{messages?.length === 0 && children}
		</div>
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
