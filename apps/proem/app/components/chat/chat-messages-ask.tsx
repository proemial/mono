"use client";
import { STARTERS } from "@/app/(pages)/(app)/(answer-engine)/starters";
import { getProfileFromUser } from "@/app/(pages)/(app)/profile/profile-from-user";
import { AnswerEngineEvents, findAllByEventType, findByEventType, findLatestByEventType } from "@/app/api/bot/answer-engine/events";
import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";
import { useUser } from "@clerk/nextjs";
import { Message, useChat } from "ai/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useShareDrawerState } from "../share/state";
import { PROEM_BOT } from "./bot-user";
import { ChatMessage, ChatMessageProps } from "./chat-message-ask";
import { useChatState } from "./state";

type Props = {
	message?: string;
	children?: ReactNode;
	initialMessages?: Message[];
	existingShareId?: string;
};

export function ChatMessages({ message, children, initialMessages, existingShareId }: Props) {
	const { question, clearQuestion, suggestions, setSuggestions } = useChatState("ask");
	const { userProfile, shareMessage, messages, isLoading, append, setMessages, data } = useShareableChat(initialMessages, existingShareId);

	const messagesDiv = useScroll(messages);
	const showLoadingState = useLoadingState(isLoading, messages);
	const getAnswerRunId = useGetRunId(data);

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

	useFollowups(data);

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
							runId={getAnswerRunId(m.role, i)}
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

function useFollowups(data: AnswerEngineEvents[]) {
	const [currentIndex, setCurrentIndex] = useState(-1);
	const { setSuggestions } = useChatState("ask");

	const { index, followups } = findLatestByEventType(data, "follow-up-questions-generated");

	useEffect(() => {
		if (followups?.length && index !== currentIndex) {
			setCurrentIndex(index);
			setSuggestions(followups?.at(0)?.map((f) => f.question) || []);
		}
	}, [currentIndex, followups, index, currentIndex, setSuggestions]);

}

function useGetRunId(data: AnswerEngineEvents[]) {
	const answerSavedEvents = findAllByEventType(data, "answer-saved");
	const runIds = answerSavedEvents.map((event) => event.runId); //match the run ID to the answer
	return (role: Message["role"], index: number) =>
		role === "assistant" ? runIds[Math.floor(index / 2)] : undefined;
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
	const shareMessage: ChatMessageProps["onShareHandle"] = () => {
		// If we're comming from a shared page we reuse the existing shareId
		const shareId =
			existingShareId ||
			findLastByEventType(chat.data, "answer-saved")?.shareId;
		openShareDrawer({
			link: `/share/${shareId}`,
			title: "Proem Science Answers",
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
