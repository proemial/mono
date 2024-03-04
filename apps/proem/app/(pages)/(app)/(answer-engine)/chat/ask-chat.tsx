"use client";

import WithHeader from "@/app/(pages)/(app)/header";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { ChatInput } from "@/app/components/chat/chat-input";
import { ChatMessageProps } from "@/app/components/chat/chat-message-ask";
import { ChatMessages } from "@/app/components/chat/chat-messages-ask";
import { cn } from "@/app/components/shadcn-ui/utils";
import { useShareDrawerState } from "@/app/components/share/state";
import { Message, useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
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
		body: { slug: sessionSlug, userId: user?.id, userEmail: user?.email },
	});
	const disabledQuestions = Boolean(initialMessages);

	const sessionSlugFromServer = (chat.data as { slug?: string }[])?.find(
		({ slug }) => slug,
	)?.slug;

	useEffect(() => {
		if (sessionSlugFromServer) {
			setSessionSlug(sessionSlugFromServer);
			// TODO! Make some condition around new router replace after initial message is recieved
			// Router.replace(`/answer/${sessionIdFromServer}`);
		}
	}, [sessionSlugFromServer]);

	const chatWrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (chat.messages?.length > 0 && chatWrapperRef.current) {
			chatWrapperRef.current.scrollIntoView(false);
		}
	}, [chat.messages]);

	useEffect(() => {
		if (message) {
			chat.setMessages([]);
			if (message.length > 0) {
				chat.append({ role: "user", content: message });
			}
		}
	}, [message, chat.setMessages, chat.append]);

	const isEmptyScreen = chat.messages.length === 0;
	const showLoadingState = chat.isLoading && chat.messages.length <= 1;
	const initialPlaceholder =
		isEmptyScreen || (chat.isLoading && chat.messages.length < 3);

	const clear = () => {
		chat.setMessages([]);
		chat.setInput("");
		setSessionSlug(null);
	};

	const shareMessage: ChatMessageProps["onShareHandle"] = ({
		renderedContent,
		message,
	}) => {
		// If we're comming from a shared page we reuse the existing shareId
		const shareId =
			existingShareId ||
			(chat.data as { answers?: { shareId: string; answer: string } }[])?.find(
				({ answers }) => answers?.answer === message,
			)?.answers?.shareId;

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
		<WithHeader title="ask" action={actionButton}>
			<div
				className={cn("flex flex-col px-4 pt-6 pb-12", {
					"h-full": isEmptyScreen,
				})}
				ref={chatWrapperRef}
			>
				{isEmptyScreen ? (
					<Starters append={chat.append} />
				) : (
					<ChatMessages
						messages={chat.messages}
						showLoadingState={showLoadingState}
						user={user}
						onShareHandle={shareMessage}
						isLoading={chat.isLoading}
					/>
				)}

				<div className="fixed left-0 w-full bg-black bottom-14 shadow-top">
					<div className="w-full max-w-screen-md px-4 pt-2 pb-3 mx-auto">
						<ChatInput
							value={chat.input}
							placeholder={
								initialPlaceholder ? "Ask anything" : "Ask a follow-up question"
							}
							onChange={chat.handleInputChange}
							onSubmit={chat.handleSubmit}
							disabled={chat.isLoading || disabledQuestions}
							trackingKey={analyticsKeys.ask.submit.ask}
						/>
					</div>
				</div>
			</div>
		</WithHeader>
	);
}
