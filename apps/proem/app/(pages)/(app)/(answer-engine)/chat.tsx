"use client";

import ChatInput from "@/app/components/chat/chat-input";
import { STARTERS } from "@/app/(pages)/(app)/(answer-engine)/starters";
import WithHeader from "@/app/(pages)/(app)/header";
import { applyLinks } from "@/app/components/chat/apply-links";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import {
	PaperCard,
	PaperCardTitle,
	PaperCardTop,
} from "@/app/components/card/paper-card";
import { ClearIcon } from "@/app/components/icons/menu/clear-icon";
import { ProemLogo } from "@/app/components/logo";
import { Button, LinkButton } from "@/app/components/proem-ui/link-button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { cn } from "@/app/components/shadcn-ui/utils";
import { useShareDrawerState } from "@/app/components/share/state";
import { Message, useChat } from "ai/react";
import { ShareIcon } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

const PROEM_BOT = {
	name: "proem",
	initials: "P",
	avatar: "/android-chrome-512x512.png",
};

type MessageProps = {
	message: Message["content"];
	user?: {
		name: string;
		initials: string;
		avatar: string;
	};
	isLoading?: boolean;
	onShareHandle?:
		| ((params: { renderedContent: React.ReactNode; message: string }) => void)
		| null;
};

export function ChatMessage({
	message,
	user = { name: "you", initials: "U", avatar: "" },
	onShareHandle,
	isLoading,
}: MessageProps) {
	const { content, links } = applyLinks(message);

	return (
		<div className="w-full">
			<div className="flex gap-3">
				<Avatar className="w-6 h-6">
					<AvatarImage src={user.avatar} />
					<AvatarFallback className="bg-gray-600">
						{user.initials}
					</AvatarFallback>
				</Avatar>
				<div className="font-bold">{user.name}</div>

				{onShareHandle && !isLoading && (
					<ShareIcon
						onClick={() => {
							onShareHandle({ renderedContent: content, message });
							Tracker.track(analyticsKeys.ask.click.share);
						}}
						className="ml-auto"
					/>
				)}
			</div>

			<div className="mt-2 ml-9">
				{content}

				{links.length > 0 && (
					<div className="pt-3 mt-3 space-y-3 border-t border-[#3C3C3C]">
						{links.map((link) => (
							<PaperCard
								key={link.href}
								className="pb-3 pt-1 border-0 rounded-lg bg-[#3C3C3C]"
							>
								{/* TODO: add date */}
								<PaperCardTop />

								<PaperCardTitle>{link.title}</PaperCardTitle>

								<LinkButton
									href={link.href}
									className="py-[1px] mt-2 no-underline"
									track={analyticsKeys.ask.click.answerCard}
								>
									Learn more...
								</LinkButton>
							</PaperCard>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

type ChatProps = Partial<Pick<MessageProps, "user" | "message">> & {
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
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		append,
		isLoading,
		setMessages,
		stop,
		setInput,
		data,
	} = useChat({
		id: "hardcoded",
		api: "/api/bot/answer-engine",
		initialMessages,
		body: { slug: sessionSlug, userId: user?.id, userEmail: user?.email },
	});
	const disabledQuestions = Boolean(initialMessages);

	const sessionSlugFromServer = (data as { slug?: string }[])?.find(
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
		if (messages?.length > 0 && chatWrapperRef.current) {
			chatWrapperRef.current.scrollIntoView(false);
		}
	}, [messages]);

	useEffect(() => {
		if (message) {
			setMessages([]);
			if (message.length > 0) {
				append({ role: "user", content: message });
			}
		}
	}, [message]);

	const isEmptyScreen = messages.length === 0;
	const showLoadingState = isLoading && messages.length <= 1;
	const clear = () => {
		setMessages([]);
		setInput("");
		setSessionSlug(null);
	};

	const shareMessage: MessageProps["onShareHandle"] = ({
		renderedContent,
		message,
	}) => {
		// If we're comming from a shared page we reuse the existing shareId
		const shareId =
			existingShareId ||
			(data as { answers?: { shareId: string; answer: string } }[])?.find(
				({ answers }) => answers?.answer === message,
			)?.answers?.shareId;

		openShareDrawer({
			link: `/share/${shareId}`,
			title: "Proem Science Answers",
			content: renderedContent,
		});
	};

	const actionButton = (
		<ActionButton
			isLoading={isLoading}
			messages={messages}
			stop={stop}
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
					<Starters append={append} />
				) : (
					<ChatMessages
						messages={messages}
						showLoadingState={showLoadingState}
						user={user}
						onShareHandle={shareMessage}
						isLoading={isLoading}
					/>
				)}

				<div className="fixed left-0 w-full bg-black bottom-14 shadow-top">
					<div className="w-full max-w-screen-md px-4 pt-2 pb-3 mx-auto">
						<ChatInput
							onSubmit={handleSubmit}
							input={input}
							onChange={handleInputChange}
							disabled={isLoading || disabledQuestions}
							placeholder="Ask anything"
							trackingKey={analyticsKeys.ask.submit.ask}
						/>
					</div>
				</div>
			</div>
		</WithHeader>
	);
}

type ActionButtonProps = {
	isLoading: boolean;
	messages: Message[];
	stop: () => void;
	clear: () => void;
};
function ActionButton(props: ActionButtonProps) {
	const { isLoading, messages, clear, stop } = props;
	const visible = !isLoading && messages.length > 0;
	const trackAndInvoke = (key: string, callback: () => void) => {
		Tracker.track(key);
		callback();
	};

	return (
		<>
			<div
				onClick={() =>
					trackAndInvoke(analyticsKeys.ask.click.stop, () => {
						stop();
						clear();
					})
				}
				className={`${
					// TODO: Fix fade in/out
					isLoading ? "opacity-100" : "opacity-0 hidden"
				} transition-all ease-in delay-300 duration-500 cursor-pointer`}
			>
				<ClearIcon />
			</div>

			<div
				onClick={() =>
					trackAndInvoke(analyticsKeys.ask.click.clear, () => clear())
				}
				className={`${
					// TODO: Fix fade in/out
					visible ? "opacity-100" : "opacity-0 hidden"
				} transition-all ease-in delay-300 duration-500 cursor-pointer`}
			>
				<ClearIcon />
			</div>
		</>
	);
}

const Starters = memo(function Starters({ append }: { append: any }) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;

	const starters = [...STARTERS]
		.map((text, index) => ({ index, text }))
		.sort(() => 0.5 - Math.random())
		.slice(0, 3);

	const trackAndInvoke = (callback: () => void) => {
		Tracker.track(analyticsKeys.ask.click.starter);
		callback();
	};

	return (
		<div className="flex flex-col h-full mb-3" suppressHydrationWarning>
			<div className="flex flex-col items-center justify-center h-full px-8 text-center">
				<Text />
			</div>
			<div className="flex flex-wrap gap-[6px]">
				{starters.map((starter) => (
					<Button
						key={starter.index}
						variant="starter"
						className="w-full mb-1 cursor-pointer"
						onClick={() => {
							trackAndInvoke(() =>
								append({ role: "user", content: starter.text }),
							);
						}}
					>
						{starter.text}
					</Button>
				))}
			</div>
		</div>
	);
});

function Text() {
	return (
		<>
			<ProemLogo includeName />
			<div className="pt-6 text-md text-white/80">
				<div>answers to your questions</div>
				<div>supported by scientific research</div>
			</div>
		</>
	);
}

type MessagesProps = Required<
	Pick<MessageProps, "onShareHandle" | "isLoading">
> &
	Pick<MessageProps, "user"> & {
		messages: Message[];
		showLoadingState: boolean;
	};

function ChatMessages({
	messages,
	showLoadingState,
	user,
	onShareHandle,
	isLoading,
}: MessagesProps) {
	return (
		<div className="w-full pb-20 space-y-5">
			{messages.map((m) => (
				<ChatMessage
					key={m.id}
					message={m.content}
					user={m.role === "assistant" ? PROEM_BOT : user}
					onShareHandle={m.role === "assistant" ? onShareHandle : null}
					isLoading={isLoading}
				/>
			))}

			{showLoadingState ? (
				<ChatMessage
					message="Searching for relevant scientific papers..."
					user={PROEM_BOT}
				/>
			) : null}
		</div>
	);
}
