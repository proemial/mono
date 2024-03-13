"use client";
import {
	AnswerEngineEvents,
	findAllByEventType,
	findByEventType,
} from "@/app/api/bot/answer-engine/events";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { ChatInputOld } from "@/app/components/chat/chat-input";
import { ChatMessageProps } from "@/app/components/chat/chat-message-ask";
import { ChatMessages } from "@/app/components/chat/chat-messages-ask";
import { ProemLogo } from "@/app/components/icons/brand/logo";
import { useShareDrawerState } from "@/app/components/share/state";
import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";
import { Message, useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { PageLayout } from "../../page-layout";
import { ClearButton } from "./clear-button";
import { Starters } from "./starters";

type ChatProps = Partial<Pick<ChatMessageProps, "user" | "message">> & {
	user?: { id: string; email: string };
	initialMessages?: Message[];
	existingShareId?: string | null;
};

export default function Chat({
	user,
	message,
	initialMessages,
	existingShareId,
}: ChatProps) {
	const [sessionSlug, setSessionSlug] = useState<null | string>(null);

	const { openShareDrawer } = useShareDrawerState();
	const chat = useChat({
		id: "hardcoded",
		api: "/api/bot/answer-engine",
		initialMessages,
		body: { slug: sessionSlug, userId: user?.id },
	}) as Omit<ReturnType<typeof useChat>, "data"> & {
		data: AnswerEngineEvents[];
	};

	useRunOnFirstRender(() => {
		if (message) {
			chat.setMessages([]);
			chat.append({ role: "user", content: message });
		}
	});

	const sessionSlugFromServer = (chat.data as { slug?: string }[])?.find(
		({ slug }) => slug,
	)?.slug;
	const disabledQuestions = Boolean(initialMessages);

	const answerSlug = findByEventType(chat.data, "answer-slug-generated")?.slug;

	useEffect(() => {
		if (answerSlug) {
			setSessionSlug(answerSlug);
			// TODO! Make some condition around new router replace after initial message is recieved
			// Router.replace(`/answer/${sessionIdFromServer}`);
		}
	}, [answerSlug]);

	const isEmptyScreen = chat.messages.length === 0;
	const showLoadingState = chat.isLoading && chat.messages.length % 2 === 1;
	const initialPlaceholder =
		isEmptyScreen || (chat.isLoading && chat.messages.length < 3);

	const clear = () => {
		chat.setMessages([]);
		chat.setInput("");
		setSessionSlug(null);
	};

	const answerSavedEvents = findAllByEventType(chat.data, "answer-saved");
	const runIds = answerSavedEvents.map((event) => event.runId);

	const shareMessage: ChatMessageProps["onShareHandle"] = ({
		renderedContent,
		message,
	}) => {
		// If we're comming from a shared page we reuse the existing shareId
		const shareId =
			existingShareId || findByEventType(chat.data, "answer-saved")?.shareId;
		openShareDrawer({
			link: `/share/${shareId}`,
			title: "Proem Science Answers",
			content: renderedContent,
		});
	};

	const actionButton = (
		<ClearButton
			isLoading={chat.isLoading}
			messages={chat.messages}
			stop={chat.stop}
			clear={clear}
		/>
	);

	return (
		<PageLayout title="ask" action={actionButton}>
			<ChatMessages
				messages={chat.messages}
				showLoadingState={showLoadingState}
				user={user}
				onShareHandle={shareMessage}
				runIds={runIds}
				isLoading={chat.isLoading}
			>
				<Text />
			</ChatMessages>

			<div className="flex flex-col gap-2 px-2 pt-1 pb-2">
				{isEmptyScreen && <Starters append={chat.append} />}
				<ChatInputOld
					chat={chat}
					placeholder={
						initialPlaceholder ? "Ask anything" : "Ask a follow-up question"
					}
					trackingKey={analyticsKeys.ask.submit.ask}
				/>
			</div>
		</PageLayout>
	);
}

function Text() {
	return (
		<div className="mt-auto mb-auto">
			<ProemLogo includeName />
			<div className="pt-6 text-center text-md text-white/80">
				<div>answers to your questions</div>
				<div>supported by scientific research</div>
			</div>
		</div>
	);
}
