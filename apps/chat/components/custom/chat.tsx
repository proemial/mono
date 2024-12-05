"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useWindowSize } from "usehooks-ts";

import { ChatHeader } from "@/components/custom/chat-header";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";
import { Vote } from "@/db/schema";
import { fetcher } from "@/lib/utils";

import { Block, UIBlock } from "./block";
import { BlockStreamHandler } from "./block-stream-handler";
import { ChatMessages } from "./chat-messages";
import { MultimodalInput } from "./multimodal-input";
import { OpenReference, Reference } from "./reference";
import { Welcome } from "./welcome";

export function Chat({
	id,
	initialMessages,
	selectedModelId,
}: {
	id: string;
	initialMessages: Array<Message>;
	selectedModelId: string;
}) {
	const { mutate } = useSWRConfig();

	const {
		messages,
		setMessages,
		handleSubmit,
		input,
		setInput,
		append,
		isLoading,
		stop,
		data: streamingData,
	} = useChat({
		body: { id, modelId: selectedModelId },
		initialMessages,
		onFinish: () => {
			mutate("/api/history");
		},
	});

	const { width: windowWidth = 1920, height: windowHeight = 1080 } =
		useWindowSize();

	const [block, setBlock] = useState<UIBlock>({
		documentId: "init",
		content: "",
		title: "",
		status: "idle",
		isVisible: false,
		boundingBox: {
			top: windowHeight / 4,
			left: windowWidth / 4,
			width: 250,
			height: 50,
		},
	});
	const [openedReference, setOpenedReference] = useState<OpenReference>({
		isVisible: false,
	});

	const { data: votes } = useSWR<Array<Vote>>(
		`/api/vote?chatId=${id}`,
		fetcher,
	);

	const [messagesContainerRef, messagesEndRef] =
		useScrollToBottom<HTMLDivElement>();

	const [attachments, setAttachments] = useState<Array<Attachment>>([]);

	const latestStreamingData = !isLoading
		? (streamingData?.at(-1) as {
				type: string;
				data: unknown;
			})
		: undefined;
	const followups =
		latestStreamingData?.type === "follow-up-questions-generated"
			? (latestStreamingData?.data as Array<{ question: string }>)?.map(
					(f) => f.question,
				)
			: undefined;

	return (
		<>
			<div className="flex flex-col min-w-0 h-dvh bg-background">
				<ChatHeader />
				<div
					ref={messagesContainerRef}
					className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
				>
					{messages.length === 0 && <Welcome />}

					<ChatMessages
						id={id}
						messages={messages}
						isLoading={isLoading}
						votes={votes}
						setOpenedReference={setOpenedReference}
					/>

					<div
						ref={messagesEndRef}
						className="shrink-0 min-w-[24px] min-h-[24px]"
					/>
				</div>
				<form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
					<MultimodalInput
						chatId={id}
						input={input}
						setInput={setInput}
						handleSubmit={handleSubmit}
						isLoading={isLoading}
						stop={stop}
						attachments={attachments}
						setAttachments={setAttachments}
						messages={messages}
						setMessages={setMessages}
						append={append}
						followups={followups}
					/>
				</form>
			</div>

			<AnimatePresence>
				{block?.isVisible && (
					<Block
						chatId={id}
						input={input}
						setInput={setInput}
						handleSubmit={handleSubmit}
						isLoading={isLoading}
						stop={stop}
						attachments={attachments}
						setAttachments={setAttachments}
						append={append}
						block={block}
						setBlock={setBlock}
						messages={messages}
						setMessages={setMessages}
						votes={votes}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{openedReference.isVisible && (
					<Reference
						chatId={id}
						input={input}
						setInput={setInput}
						handleSubmit={handleSubmit}
						isLoading={isLoading}
						stop={stop}
						attachments={attachments}
						setAttachments={setAttachments}
						append={append}
						openedReference={openedReference}
						setOpenedReference={setOpenedReference}
						messages={messages}
						setMessages={setMessages}
						votes={votes}
						followups={followups}
					/>
				)}
			</AnimatePresence>

			<BlockStreamHandler streamingData={streamingData} setBlock={setBlock} />
		</>
	);
}
