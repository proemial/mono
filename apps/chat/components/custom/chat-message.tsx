"use client";

import { Message } from "ai";
import cx from "classnames";
import { motion } from "framer-motion";

import { Vote } from "@/db/schema";

import { ProemIcon, SparklesIcon } from "./icons"; // Add this import at the top with other icons
import { SearchMd } from "@untitled-ui/icons-react";
import { MessageActions } from "./message-actions";
import { PreviewAttachment } from "./preview-attachment";
import { PaperReferences } from "./paper/paper-references";
import { OpenReference, ReferencePreview } from "./reference";
import { Dispatch, SetStateAction, useRef, useEffect } from "react";
import { useTextWithReferences } from "./reference-parser";

type Props = {
	chatId: string;
	message: Message;
	papers?: ReferencePreview[];
	openedReference: OpenReference;
	setOpenedReference: Dispatch<SetStateAction<OpenReference>>;
	vote: Vote | undefined;
	isLoading: boolean;
};

export const Answer = ({
	chatId,
	message,
	papers,
	openedReference,
	setOpenedReference,
	vote,
	isLoading,
}: Props) => {
	const { markup, indexedPapers, prefix } = useTextWithReferences(
		message.content,
		papers,
	);

	return (
		<motion.div
			className="w-full mx-auto max-w-3xl px-4 group/message"
			initial={{ y: 5, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			data-role={message.role}
		>
			<div
				className={cx(
					"group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl] ",
				)}
			>
				{message.role === "assistant" && (
					<div className="size-7 flex items-center rounded-full justify-center shrink-0 bg-foreground/80 text-background -mt-1">
						<ProemIcon size={14} />
					</div>
				)}

				<div className="flex flex-col gap-2 w-full">
					<div>{markup}</div>
					<MessageActions
						key={`action-${message.id}`}
						chatId={chatId}
						message={message}
						vote={vote}
						isLoading={isLoading}
					/>

					{indexedPapers?.at(0) && (
						<PaperReferences
							papers={indexedPapers}
							openedReference={openedReference}
							setOpenedReference={setOpenedReference}
							prefix={prefix}
						/>
					)}

					{message.experimental_attachments && (
						<div className="flex flex-row gap-2">
							{message.experimental_attachments.map((attachment) => (
								<PreviewAttachment
									key={attachment.url}
									attachment={attachment}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export const Question = ({
	message,
}: {
	message: Message;
}) => {
	const messageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messageRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	return (
		<motion.div
			ref={messageRef}
			className="w-full mx-auto max-w-3xl px-4 group/message"
			initial={{ y: 5, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			data-role={message.role}
		>
			<div
				className={cx(
					"bg-primary text-primary-foreground flex gap-4 px-3 w-fit ml-auto max-w-2xl py-2 rounded-xl shadow-sm text-shadow",
				)}
			>
				<div className="flex flex-col gap-2 w-full">
					<div>{message.content}</div>
				</div>
			</div>
		</motion.div>
	);
};

export const LoadingMessage = () => {
	const role = "assistant";

	return (
		<motion.div
			className="w-full mx-auto max-w-3xl px-4 group/message "
			initial={{ y: 5, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
			data-role={role}
		>
			<div
				className={cx(
					"flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl ",
					{
						"group-data-[role=user]/message:bg-muted": true,
					},
				)}
			>
				<div className="size-7 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border -mt-1">
					<SearchMd className="size-3.5 motion-safe:animate-pulse" />
				</div>

				<div className="flex flex-col gap-2 w-full">
					<div className="text-muted-foreground">
						<span className="motion-safe:animate-pulse">
							Searching for related research papers
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};
