"use client";

import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import cx from "classnames";
import { motion } from "framer-motion";
import React, {
	useRef,
	useEffect,
	useState,
	useCallback,
	Dispatch,
	SetStateAction,
	ChangeEvent,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { sanitizeUIMessages } from "@/lib/utils";

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const suggestedActions = [
	{
		title: "Do vaccines cause autism spectrum disorder?",
		action: "Do vaccines cause autism spectrum disorder?",
	},
	{
		title: "Is a daily glass of wine healthy?",
		action: "Is a daily glass of wine healthy?",
	},
	{
		title: "Do cell phones cause brain cancer?",
		action: "Do cell phones cause brain cancer?",
	},
	{
		title: "What is the universe made of?",
		action: "What is the universe made of?",
	},
	{
		title: "How can I lower my blood pressure?",
		action: "How can I lower my blood pressure?",
	},
	{
		title: "What can I do for heartburn relief?",
		action: "What can I do for heartburn relief?",
	},
	{
		title: "Is microwaved food unsafe?",
		action: "Is microwaved food unsafe?",
	},
	{
		title: "Why do we dream?",
		action: "Why do we dream?",
	},
	{
		title: "What is the theory of evolution by natural selection?",
		action: "What is the theory of evolution by natural selection?",
	},
	{
		title: "What is the structure of DNA?",
		action: "What is the structure of DNA?",
	},
	{
		title: "What causes the seasons?",
		action: "What causes the seasons?",
	},
	{
		title: "How do vaccines work?",
		action: "How do vaccines work?",
	},
	{
		title: "What is photosynthesis?",
		action: "What is photosynthesis?",
	},
	{
		title: "What are the laws of thermodynamics?",
		action: "What are the laws of thermodynamics?",
	},
	{
		title: "What is the Big Bang Theory?",
		action: "What is the Big Bang Theory?",
	},
	{
		title: "How does antibiotic resistance develop?",
		action: "How does antibiotic resistance develop?",
	},
	{
		title: "What is plate tectonics?",
		action: "What is plate tectonics?",
	},
	{
		title: "How do black holes form?",
		action: "How do black holes form?",
	},
	{
		title: "What is quantum mechanics?",
		action: "What is quantum mechanics?",
	},
	{
		title: "What causes earthquakes?",
		action: "What causes earthquakes?",
	},
	{
		title: "What is the greenhouse effect?",
		action: "What is the greenhouse effect?",
	},
	{
		title: "What are stem cells?",
		action: "What are stem cells?",
	},
	{
		title: "What is the process of natural selection?",
		action: "What is the process of natural selection?",
	},
	{
		title: "How does the water cycle work?",
		action: "How does the water cycle work?",
	},
	{
		title: "What is relativity theory?",
		action: "What is relativity theory?",
	},
	{
		title: "What causes global warming?",
		action: "What causes global warming?",
	},
];

export function MultimodalInput({
	chatId,
	input,
	setInput,
	isLoading,
	stop,
	attachments,
	setAttachments,
	messages,
	setMessages,
	append,
	handleSubmit,
	className,
}: {
	chatId: string;
	input: string;
	setInput: (value: string) => void;
	isLoading: boolean;
	stop: () => void;
	attachments: Array<Attachment>;
	setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
	messages: Array<Message>;
	setMessages: Dispatch<SetStateAction<Array<Message>>>;
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
	className?: string;
}) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { width } = useWindowSize();

	useEffect(() => {
		if (textareaRef.current) {
			adjustHeight();
		}
	}, []);

	const adjustHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
		}
	};

	const [localStorageInput, setLocalStorageInput] = useLocalStorage(
		"input",
		"",
	);

	useEffect(() => {
		if (textareaRef.current) {
			const domValue = textareaRef.current.value;
			// Prefer DOM value over localStorage to handle hydration
			const finalValue = domValue || localStorageInput || "";
			setInput(finalValue);
			adjustHeight();
		}
		// Only run once after hydration
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setLocalStorageInput(input);
	}, [input, setLocalStorageInput]);

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value);
		adjustHeight();
	};

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

	const submitForm = useCallback(() => {
		window.history.replaceState({}, "", `/chat/${chatId}`);

		handleSubmit(undefined, {
			experimental_attachments: attachments,
		});

		setAttachments([]);
		setLocalStorageInput("");

		if (width && width > 768) {
			textareaRef.current?.focus();
		}
	}, [
		attachments,
		handleSubmit,
		setAttachments,
		setLocalStorageInput,
		width,
		chatId,
	]);

	const uploadFile = async (file: File) => {
		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch(`/api/files/upload`, {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				const { url, pathname, contentType } = data;

				return {
					url,
					name: pathname,
					contentType: contentType,
				};
			} else {
				const { error } = await response.json();
				toast.error(error);
			}
		} catch (error) {
			toast.error("Failed to upload file, please try again!");
		}
	};

	const handleFileChange = useCallback(
		async (event: ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(event.target.files || []);

			setUploadQueue(files.map((file) => file.name));

			try {
				const uploadPromises = files.map((file) => uploadFile(file));
				const uploadedAttachments = await Promise.all(uploadPromises);
				const successfullyUploadedAttachments = uploadedAttachments.filter(
					(attachment) => attachment !== undefined,
				);

				setAttachments((currentAttachments) => [
					...currentAttachments,
					...successfullyUploadedAttachments,
				]);
			} catch (error) {
				console.error("Error uploading files!", error);
			} finally {
				setUploadQueue([]);
			}
		},
		[setAttachments],
	);

	return (
		<div className="relative w-full flex flex-col gap-4">
			{messages.length === 0 &&
				attachments.length === 0 &&
				uploadQueue.length === 0 && (
					<div className="grid sm:grid-cols-2 gap-2 w-full">
						{suggestedActions
							.sort(() => Math.random() - 0.5)
							.slice(0, 4)
							.map((suggestedAction, index) => (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{ delay: 0.05 * index }}
									key={index}
									className={index > 1 ? "hidden sm:block" : "block"}
								>
									<Button
										variant="ghost"
										onClick={async () => {
											window.history.replaceState({}, "", `/chat/${chatId}`);

											append({
												role: "user",
												content: suggestedAction.action,
											});
										}}
										className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
									>
										<span className="font-medium">{suggestedAction.title}</span>
										{/* <span className="text-muted-foreground">
                    {suggestedAction.label}
                  </span> */}
									</Button>
								</motion.div>
							))}
					</div>
				)}

			<input
				type="file"
				className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
				ref={fileInputRef}
				multiple
				onChange={handleFileChange}
				tabIndex={-1}
			/>

			{(attachments.length > 0 || uploadQueue.length > 0) && (
				<div className="flex flex-row gap-2 overflow-x-scroll items-end">
					{attachments.map((attachment) => (
						<PreviewAttachment key={attachment.url} attachment={attachment} />
					))}

					{uploadQueue.map((filename) => (
						<PreviewAttachment
							key={filename}
							attachment={{
								url: "",
								name: filename,
								contentType: "",
							}}
							isUploading={true}
						/>
					))}
				</div>
			)}

			<Textarea
				ref={textareaRef}
				placeholder="Send a message..."
				value={input}
				onChange={handleInput}
				className={cx(
					"min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl text-base bg-muted",
					className,
				)}
				rows={3}
				autoFocus
				onKeyDown={(event) => {
					if (event.key === "Enter" && !event.shiftKey) {
						event.preventDefault();

						if (isLoading) {
							toast.error("Please wait for the model to finish its response!");
						} else {
							submitForm();
						}
					}
				}}
			/>

			{isLoading ? (
				<Button
					className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
					onClick={(event) => {
						event.preventDefault();
						stop();
						setMessages((messages) => sanitizeUIMessages(messages));
					}}
				>
					<StopIcon size={14} />
				</Button>
			) : (
				<Button
					className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
					onClick={(event) => {
						event.preventDefault();
						submitForm();
					}}
					disabled={input.length === 0 || uploadQueue.length > 0}
				>
					<ArrowUpIcon size={14} />
				</Button>
			)}

			<Button
				className="rounded-full p-1.5 h-fit absolute bottom-2 right-11 m-0.5 dark:border-zinc-700"
				onClick={(event) => {
					event.preventDefault();
					fileInputRef.current?.click();
				}}
				variant="outline"
				disabled={isLoading}
			>
				<PaperclipIcon size={14} />
			</Button>
		</div>
	);
}
