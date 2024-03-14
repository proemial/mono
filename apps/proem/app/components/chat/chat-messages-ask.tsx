"use client";
import { ChatMessage, ChatMessageProps } from "./chat-message-ask";
import { ReactNode, use, useEffect, useRef, useState } from "react";
import { useChatState } from "./state";
import { Message, UseChatHelpers, useChat } from "ai/react";
import { useUser } from "@clerk/nextjs";
import { getProfileFromUser } from "@/app/(pages)/(app)/profile/profile-from-user";
import { AnswerEngineEvents, findByEventType } from "@/app/api/bot/answer-engine/events";
import { PROEM_BOT } from "./bot-user";
import { useShareDrawerState } from "../share/state";
import { STARTERS } from "@/app/(pages)/(app)/(answer-engine)/starters";
import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";

type Props = {
	message?: string;
	children?: ReactNode;
	initialMessages?: Message[];
	existingShareId?: string;
};

export function ChatMessages({ message, children, initialMessages, existingShareId }: Props) {
	const { questions, setSuggestions, setLoading } = useChatState("ask");
	const { userProfile, shareMessage, messages, isLoading, append, setMessages } = useShareableChat(initialMessages, existingShareId);

	const messagesDiv = useScroll(messages);
	const showLoadingState = useLoadingState(isLoading, messages);

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
		if (questions?.length > 0) {
			appendQuestion(questions.at(-1) as string);
			setSuggestions([]);
		}
	}, [questions, setSuggestions]);

	const appendQuestion = (question: string) =>
		append({ role: "user", content: question });

	return (
		<>
			{messages?.length > 0 &&
				<div ref={messagesDiv} className="pb-32">
					{messages.map((m, i) => (
						<ChatMessage
							key={i}
							message={m.content}
							user={m.role === "assistant" ? PROEM_BOT : userProfile}
							onShareHandle={shareMessage}
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

function useScroll(messages: Message[]) {
	const messagesDiv = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (messagesDiv.current && messages) {
			messagesDiv.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
		}
	}, [messages]);

	return messagesDiv;
}

function useLoadingState(isLoading: boolean, messages: Message[]) {
	const { setLoading } = useChatState("ask");

	useEffect(() => {
		setLoading(isLoading);
	}, [isLoading, setLoading]);

	return isLoading && messages.length % 2 === 1;
}

function useShareableChat(initialMessages?: Message[], existingShareId?: string) {
	const [sessionSlug, setSessionSlug] = useState<null | string>(null);

	const { user } = useUser();

	const chat = useChat({
		id: "hardcoded",
		api: "/api/bot/answer-engine",
		initialMessages,
		body: { slug: sessionSlug, userId: user?.id },
	}) as Omit<ReturnType<typeof useChat>, "data"> & {
		data: AnswerEngineEvents[];
	};

	const { openShareDrawer } = useShareDrawerState();
	const shareMessage: ChatMessageProps["onShareHandle"] = ({ renderedContent }) => {
		// If we're comming from a shared page we reuse the existing shareId
		const shareId = existingShareId || findByEventType(chat.data, "answer-saved")?.shareId;
		openShareDrawer({
			link: `/share/${shareId}`,
			title: "Proem Science Answers",
			content: renderedContent,
		});
	};

	const answerSlug = findByEventType(chat.data, "answer-slug-generated")?.slug;
	useEffect(() => {
		if (answerSlug) {
			setSessionSlug(answerSlug);
			// TODO! Make some condition around new router replace after initial message is recieved
			// Router.replace(`/answer/${sessionIdFromServer}`);
		}
	}, [answerSlug]);

	const userProfile = getProfileFromUser(user);

	return { userProfile, sessionSlug, shareMessage, ...chat };
}