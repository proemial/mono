"use client";
import { STARTERS } from "@/app/(pages)/(app)/(answer-engine)/starters";
import { getProfileFromUser } from "@/app/(pages)/(app)/profile/profile-from-user";
import {
	type AnswerEngineEvents,
	findAllByEventType,
	findByEventType,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";
import { useUser } from "@clerk/nextjs";
import { type Message, useChat } from "ai/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useShareDrawerState } from "../share/state";
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
	existingShareId,
}: Props) {
	const { question, clearQuestion, setSuggestions } = useChatState("ask");
	const {
		userProfile,
		shareMessage,
		messages,
		isLoading,
		append,
		setMessages,
		data,
	} = useShareableChat(initialMessages, existingShareId);

	const messagesDiv = useScroll(messages);
	const showLoadingState = useLoadingState(isLoading, messages);
	const getAnswerRunId = getRunId(data);

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
			{messages?.length > 0 && (
				<div ref={messagesDiv} className="pb-32">
					{messages.map((message, i) => {
						const isMessageFromAI = message.role === "assistant";
						const isLastMessage = i === messages.length - 1;
						// Prevent settings prior messages in a conversation to a loading state while we wait for the AI to respond
						const isLastMessageAndLoading = isLastMessage ? isLoading : false;
						const transactionId = isMessageFromAI
							? // We`r looking up the prior message so it can't be undefined
							messages.at(i - 1)?.id
							: message.id;
						const onShareHandle =
							isMessageFromAI && !isLastMessageAndLoading
								? () => shareMessage(transactionId as string)
								: undefined;

						return (
							<ChatMessage
								key={message.id}
								message={message.content}
								user={isMessageFromAI ? PROEM_BOT : userProfile}
								onShareHandle={onShareHandle}
								runId={getAnswerRunId(message.role, i)}
								isLoading={isLastMessageAndLoading}
								showThrobber={isMessageFromAI && isLoading && isLastMessage}
								showLinkCards={false}
							/>
						);
					})}

					{showLoadingState && <ChatMessage user={PROEM_BOT} />}
				</div>
			)}
			{messages.length === 0 && children}
		</>
	);
}

function useFollowups(data: AnswerEngineEvents[]) {
	const [currentIndex, setCurrentIndex] = useState(-1);
	const { setSuggestions } = useChatState("ask");

	const { index, followups } = findLatestByEventType(
		data,
		"follow-up-questions-generated",
	);

	useEffect(() => {
		if (followups?.length && index !== currentIndex) {
			setCurrentIndex(index);
			setSuggestions(followups?.at(0)?.map((f) => f.question) || []);
		}
	}, [currentIndex, followups, index, currentIndex, setSuggestions]);
}

function getRunId(data: AnswerEngineEvents[]) {
	const answerSavedEvents = findAllByEventType(data, "answer-saved");
	const runIds = answerSavedEvents.map((event) => event.runId); //match the run ID to the answer
	// This only works if the amount of assistant messages is the same as the amount of runIds pushed from the server?
	return (role: Message["role"], index: number) =>
		role === "assistant" ? runIds[Math.floor(index / 2)] : undefined;
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

function useLoadingState(isLoading: boolean, messages: Message[]) {
	const { setLoading } = useChatState("ask");

	useEffect(() => {
		setLoading(isLoading);
	}, [isLoading, setLoading]);

	return isLoading && messages.length % 2 === 1;
}

function useShareableChat(
	initialMessages?: Message[],
	existingShareId?: string,
) {
	const [sessionSlug, setSessionSlug] = useState<null | string>(null);

	const { user } = useUser();

	const chat = useChat({
		sendExtraMessageFields: true,
		id: "hardcoded",
		api: "/api/bot/ask2",
		initialMessages,
		body: { slug: sessionSlug, userId: user?.id },
	}) as Omit<ReturnType<typeof useChat>, "data"> & {
		data: AnswerEngineEvents[];
	};

	const { openShareDrawer } = useShareDrawerState();

	// Each transactionId corrolates to the messageId of the question in an question/answer pair
	const shareMessage = (transactionId: string) => {
		// If no shareId is found in the event stream & we have an existingShareId we assume we're on the shared page and fallback to that
		const shareId =
			findByEventType(chat.data, "answer-saved", transactionId)?.shareId ||
			// If we're comming from a shared page we reuse the existing shareId
			existingShareId;

		openShareDrawer({
			link: `/share/${shareId}`,
			title: "Science Answers",
		});
	};

	// TODO! This ONLY works because we don't update the answerSlug after the first message is recieved. Event if multiple answer-slug-generated request is send.
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
