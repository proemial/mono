"use client";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { ChatInputOld } from "@/app/components/chat/chat-input";
import { ChatMessageProps } from "@/app/components/chat/chat-message-ask";
import { ChatMessages } from "@/app/components/chat/chat-messages-ask";
import { useShareDrawerState } from "@/app/components/share/state";
import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";
import { Message, useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { ClearButton } from "./clear-button";
import { Starters } from "./starters";
import { PageLayout } from "../../page-layout";
import { ProemLogo } from "@/app/components/icons/brand/logo";

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
	const [inputFocus, setInputFocus] = useState<boolean>();

	const { openShareDrawer } = useShareDrawerState();
	const chat = useChat({
		id: "hardcoded",
		api: "/api/bot/answer-engine",
		initialMessages,
		body: { slug: sessionSlug, userId: user?.id },
	});

	useRunOnFirstRender(() => {
		if (message) {
			chat.setMessages([]);
			chat.append({ role: "user", content: message });
		}
	});

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

	const messagesDiv = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (messagesDiv.current) {
			console.log("scrolling to bottom", chat.messages?.length);

			messagesDiv.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
		}
	}, [chat.messages]);

	const isEmptyScreen = chat.messages.length === 0;
	const showLoadingState = chat.isLoading && chat.messages.length % 2 === 1;
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
		<PageLayout title="ask" action={actionButton}>
			<>
				{isEmptyScreen && <Text />}
				<div className="pb-32 messages" ref={messagesDiv}>
					<ChatMessages
						messages={chat.messages}
						showLoadingState={showLoadingState}
						user={user}
						onShareHandle={shareMessage}
						isLoading={chat.isLoading}
					/>
				</div>
			</>

			<div className="flex flex-col gap-2 px-2 pt-1 pb-2">
				{(isEmptyScreen || inputFocus) && <Starters append={chat.append} />}
				<ChatInputOld
					chat={chat}
					placeholder={
						initialPlaceholder ? "Ask anything" : "Ask a follow-up question"
					}
					trackingKey={analyticsKeys.ask.submit.ask}
					onFocusChange={(isFocused) => {
						setInputFocus(isFocused);
					}}
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
