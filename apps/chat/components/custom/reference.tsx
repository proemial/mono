import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import { useWindowSize } from "usehooks-ts";

import { Vote } from "@/db/schema";

import { RetrievalResult } from "@/app/(chat)/api/chat/route";
import { Button } from "../ui/button";
import { CrossIcon } from "./icons";
import { MultimodalInput } from "./multimodal-input";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import { ChatMessages } from "./chat-messages";
import { Markdown } from "./markdown";
import dynamic from "next/dynamic";

const ResearchPaper = dynamic(() => import("./paper/paper"), {
	ssr: false,
});

export type OpenReference = {
	isVisible: boolean;
	preview?: ReferencePreview;
	boundingBox?: {
		top: number;
		left: number;
		width: number;
		height: number;
	};
};
export type ReferencePreview = RetrievalResult[number];

export function Reference({
	chatId,
	input,
	setInput,
	handleSubmit,
	isLoading,
	stop,
	// attachments,
	// setAttachments,
	append,
	openedReference,
	setOpenedReference,
	messages,
	setMessages,
	votes,
	followups,
}: {
	chatId: string;
	input: string;
	setInput: (input: string) => void;
	isLoading: boolean;
	stop: () => void;
	// attachments: Array<Attachment>;
	// setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
	openedReference: OpenReference;
	setOpenedReference: Dispatch<SetStateAction<OpenReference>>;
	messages: Array<Message>;
	setMessages: Dispatch<SetStateAction<Array<Message>>>;
	votes: Array<Vote> | undefined;
	append: (
		message: Message | CreateMessage,
		chatRequestOptions?: ChatRequestOptions,
	) => Promise<string | null | undefined>;
	handleSubmit: (
		event?: {
			preventDefault?: () => void;
		},
		chatRequestOptions?: ChatRequestOptions,
	) => void;
	followups?: string[];
}) {
	const [messagesContainerRef, messagesEndRef] =
		useScrollToBottom<HTMLDivElement>();

	const { width: windowWidth, height: windowHeight } = useWindowSize();
	const isMobile = windowWidth ? windowWidth < 768 : false;

	return (
		<motion.div
			className="flex flex-row h-dvh w-dvw fixed top-0 left-0 z-50 bg-muted"
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, transition: { delay: 0.4 } }}
		>
			{!isMobile && (
				<motion.div
					className="relative w-[400px] bg-muted dark:bg-background h-dvh shrink-0"
					initial={{ opacity: 0, x: 10, scale: 1 }}
					animate={{
						opacity: 1,
						x: 0,
						scale: 1,
						transition: {
							delay: 0.2,
							type: "spring",
							stiffness: 200,
							damping: 30,
						},
					}}
					exit={{
						opacity: 0,
						x: 0,
						scale: 0.95,
						transition: { delay: 0 },
					}}
				>
					<div className="flex flex-col h-full justify-between items-center gap-4">
						<div
							ref={messagesContainerRef}
							className="flex flex-col gap-4 h-full items-center overflow-y-scroll px-4 pt-[3rem]"
						>
							<ChatMessages
								id={chatId}
								messages={messages}
								isLoading={isLoading}
								votes={votes}
								openedReference={openedReference}
								setOpenedReference={setOpenedReference}
							/>

							<div
								ref={messagesEndRef}
								className="shrink-0 min-w-[24px] min-h-[24px]"
							/>
						</div>

						<form className="flex flex-row gap-2 relative items-end w-full px-4 pb-4">
							<MultimodalInput
								chatId={chatId}
								input={input}
								setInput={setInput}
								handleSubmit={handleSubmit}
								isLoading={isLoading}
								stop={stop}
								// attachments={attachments}
								// setAttachments={setAttachments}
								messages={messages}
								append={append}
								className="bg-background dark:bg-muted"
								setMessages={setMessages}
								followups={followups}
							/>
						</form>
					</div>
				</motion.div>
			)}

			<motion.div
				className="fixed dark:bg-muted bg-background h-dvh flex flex-col shadow-xl overflow-y-scroll"
				initial={
					isMobile
						? {
								opacity: 0,
								x: 0,
								y: 0,
								width: windowWidth,
								height: windowHeight,
								borderRadius: 50,
							}
						: {
								opacity: 0,
								x: openedReference?.boundingBox?.left,
								y: openedReference?.boundingBox?.top,
								height: openedReference?.boundingBox?.height,
								width: openedReference?.boundingBox?.width,
								borderRadius: 50,
							}
				}
				animate={
					isMobile
						? {
								opacity: 1,
								x: 0,
								y: 0,
								width: windowWidth,
								height: "100dvh",
								borderRadius: 0,
								transition: {
									delay: 0,
									type: "spring",
									stiffness: 200,
									damping: 30,
								},
							}
						: {
								opacity: 1,
								x: 400,
								y: 0,
								height: windowHeight,
								width: windowWidth ? windowWidth - 400 : "calc(100dvw-400px)",
								borderRadius: 0,
								transition: {
									delay: 0,
									type: "spring",
									stiffness: 200,
									damping: 30,
								},
							}
				}
				exit={{
					opacity: 0,
					scale: 0.5,
					transition: {
						delay: 0.1,
						type: "spring",
						stiffness: 600,
						damping: 30,
					},
				}}
			>
				<div className="p-2 relative flex flex-row justify-between items-start w-full after:content-[''] after:absolute after:left-0 after:right-0 after:h-4 after:bg-gradient-to-b after:from-background dark:after:from-muted after:to-transperant after:top-12 after:pointer-events-none">
					<div className="flex flex-row gap-3 items-start w-full">
						<Button
							variant="outline"
							className="h-fit p-2 dark:hover:bg-zinc-700"
							onClick={() => {
								setOpenedReference((currentBlock) => ({
									...currentBlock,
									isVisible: false,
								}));
							}}
						>
							<CrossIcon size={18} />
						</Button>

						<div className="text-base md:text-xl h-8 items-center text-muted-foreground truncate leading-8">
							<Markdown>{openedReference.preview?.title ?? ""}</Markdown>
						</div>
					</div>
				</div>
				<div className="h-full flex flex-col overflow-y-auto ">
					<div className="prose dark:prose-invert dark:bg-muted bg-background flex-1 max-w-[700px] px-4 pt-2 xl:pt-10 lg:mx-auto items-center">
						{openedReference?.preview && (
							<ResearchPaper
								id={openedReference.preview.link.split("/").pop() || ""}
							/>
						)}
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
