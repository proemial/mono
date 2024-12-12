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
// import { PreviewAttachment } from "./preview-attachment";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const suggestedActions = [
"Is solar or nuclear better for CO2?",
"Do masks lower the spread of viruses?",
"Does plastic waste impact ocean ecosystems?",
"Can technology improve learning outcomes?",
"Could no-till farming improve soil conservation?",
"Are electric cars better over their lifecycle?",
"Can greywater recycling improve urban life?",
"Can urban parks lower temperature and pollution?",
"Does community policing reduce urban crime?",
"Are immunotherapy or chemo more effective?",
"Is online therapy effective?",
"Do organic foods have fewer pesticides?",
"Does net neutrality spur innovation?",
"Can zero-waste policies reduce landfill?",
"Best way to heal strain injuries?",
"Do solar subsidies increase adoption?",
"Explain impacts of rent control on housing markets",
"Best early warning systems to reduce casualties?",
"Do fruits and vegetables lower chronic disease?",
"Do marine protected areas improve biodiversity?",
"Can reforestation increase carbon emissions?",
"Do electric cars increase pollution?",
"Can vaccination lead to spikes in disease?",
"Will increased health spending reduce total costs?",
"Can pollution control worsen greenhouse emissions?",
"Does organic farming increase water usage?",
"Can homework worsen educational outcomes?",
"Can smaller classes lead to lower achievement?",
"Can GMO crops enhance biodiversity?",
"Does organic farming produce more greenhouse gases?",
"Is nuclear power safer than solar power?",
"Do biofuels increase total carbon emissions?",
"Can desalination worsen water scarcity?",
"Does water conservation lead to higher water usage?",
"Does high-density housing have lower energy use?",
"Can bike lanes increase car traffic?",
"Can street lights cause higher crime rates?",
"Does decriminalization reduce overall crime?",
"Does fast-tracking drugs reduce patient safety?",
"Do strict drug regulations increase prices?",
"Can easy access to mental health services increase reported issues?",
"Does social media decrease loneliness in older adults?",
"Does strict food safety increase food waste?",
"Do preservatives reduce foodborne illness?",
"Can increased internet regulation improve online security?",
"Do data caps foster internet innovation?",
"Can recycling increase overall energy consumption?",
"Is banning plastic bags eco-friendly?",
"Can ergonomic keyboards cause repetitive strain injuries?",
"Do subsidies slow innovation in energy storage?",
"Do renewable energy incentives cause lower gas prices?",
"Can affordable housing increase housing prices?",
"Do rent freezes lead to decreased housing quality?",
"Can early disaster evacuations increase casualties?",
"Can seawalls increase damage from storm surges?",
"Can dietary supplements cause health issues?",
"Do artificial sweeteners pose health risks?",
"Can sustainable fishing decrease biodiversity?",
"Do marine sanctuaries cause fishing in more vulnerable areas?",
"Do solar farms disrupt local ecosystems?",
"Do park projects cause gentrification?",
"Do flu vaccinations cause flu-like symptoms?",
"Have antibiotics decreased vaccine effectiveness?",
"Do LED lights increase light pollution?",
"Do electric vehicle batteries pollute landfills?",
"Has online learning widened the achievement gap?",
"Does bilingual education delay language proficiency?",
"Does crop rotation reduce soil quality?",
"Have biofuel subsidies raised food prices?",
"Do wind turbines harm bird populations?",
"Do energy-efficient appliances consume more energy?",
"Has bottled water consumption degraded municipal systems?",
"Do water-saving fixtures lead to increased water use?",
"Do pedestrian zones increase carbon emissions?",
"Have smart cities raised privacy concerns?",
"Do gun buyback programs reduce violent crime?",
"Have body cameras reduced police misconduct?",
"Do expedited approvals increase drug recalls?",
"Does off-label use improve patient outcomes?",
"Has school screening reduced mental health issues?",
"Do mental health apps increase anxiety?",
"Has GMO labeling decreased consumer trust?",
"Do farm-to-table initiatives increase illness?",
"Has rural broadband spurred economic growth?",
"Do unlimited plans increase network congestion?",
"Do composting programs attract urban pests?",
"Does single-stream recycling increase contamination?",
"Do open offices spread diseases?",
"Do standing desks reduce health issues?",
"Do solar subsidies benefit wealthier households?",
"Do energy credits reduce greenhouse gas emissions?",
"Does inclusionary zoning reduce housing development?",
"Do rental regulations stabilize housing markets?",
"Do earthquake warnings reduce injuries?",
"Do recovery funds reinforce inequalities?",
"Have low-fat diets increased obesity?",
"Do school programs improve dietary habits?",
"Do catch share programs lead to overfishing?",
"Have artificial reefs improved biodiversity?",
];

export function MultimodalInput({
	chatId,
	input,
	setInput,
	isLoading,
	stop,
	// attachments,
	// setAttachments,
	messages,
	setMessages,
	append,
	handleSubmit,
	className,
	followups,
	scrolledToBottom,
	checkScrollPosition,
}: {
	chatId: string;
	input: string;
	setInput: (value: string) => void;
	isLoading: boolean;
	stop: () => void;
	// attachments: Array<Attachment>;
	// setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
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
	followups?: string[];
	scrolledToBottom?: boolean;
	checkScrollPosition?: () => void;
	/** Updates the scrolledToBottom state when scroll position changes */
}) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { width } = useWindowSize();

	useEffect(() => {
		if (textareaRef.current) {
			adjustHeight();
		}
	}, []);

	const [localStorageInput, setLocalStorageInput] = useLocalStorage(
		"input",
		"",
	);

	const adjustHeight = useCallback(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
		}
	}, []);

	useEffect(() => {
		if (textareaRef.current) {
			const domValue = textareaRef.current.value;
			const finalValue = domValue || localStorageInput || "";
			setInput(finalValue);
			adjustHeight();
		}
	}, [localStorageInput, setInput, adjustHeight]);

	useEffect(() => {
		setLocalStorageInput(input);
	}, [input, setLocalStorageInput]);

	const [suggestions, setSuggestions] = useState<string[]>([]);
	useEffect(() => {
		const randomSuggestions = suggestedActions
			.sort(() => Math.random() - 0.5)
			.slice(0, 4);
		setSuggestions(randomSuggestions);
	}, []);

	useEffect(() => {
		console.log("trigger when followups changes", followups);
		checkScrollPosition?.();
	}, [followups, checkScrollPosition]);

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value);
		adjustHeight();
	};

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

	const submitForm = useCallback(() => {
		window.history.replaceState({}, "", `/chat/${chatId}`);

		handleSubmit(undefined, {
			//experimental_attachments: attachments,
		});

		//setAttachments([]);
		setLocalStorageInput("");

		if (width && width > 768) {
			textareaRef.current?.focus();
		}
	}, [
		// attachments,
		handleSubmit,
		//setAttachments,
		setLocalStorageInput,
		width,
		chatId,
	]);

	// const uploadFile = async (file: File) => {
	// 	const formData = new FormData();
	// 	formData.append("file", file);

	// 	try {
	// 		const response = await fetch(`/api/files/upload`, {
	// 			method: "POST",
	// 			body: formData,
	// 		});

	// 		if (response.ok) {
	// 			const data = await response.json();
	// 			const { url, pathname, contentType } = data;

	// 			return {
	// 				url,
	// 				name: pathname,
	// 				contentType: contentType,
	// 			};
	// 		} else {
	// 			const { error } = await response.json();
	// 			toast.error(error);
	// 		}
	// 	} catch (error) {
	// 		toast.error("Failed to upload file, please try again!");
	// 	}
	// };

	// const handleFileChange = useCallback(
	// 	async (event: ChangeEvent<HTMLInputElement>) => {
	// 		const files = Array.from(event.target.files || []);

	// 		setUploadQueue(files.map((file) => file.name));

	// 		try {
	// 			const uploadPromises = files.map((file) => uploadFile(file));
	// 			const uploadedAttachments = await Promise.all(uploadPromises);
	// 			const successfullyUploadedAttachments = uploadedAttachments.filter(
	// 				(attachment) => attachment !== undefined,
	// 			);

	// 			setAttachments((currentAttachments) => [
	// 				...currentAttachments,
	// 				...successfullyUploadedAttachments,
	// 			]);
	// 		} catch (error) {
	// 			console.error("Error uploading files!", error);
	// 		} finally {
	// 			setUploadQueue([]);
	// 		}
	// 	},
	// 	[setAttachments],
	// );

	const starters = followups
		? followups
		: messages.length === 0
			? suggestions
			: undefined;

	return (
		<div className="relative w-full flex flex-col gap-4">
			{starters && (
				<motion.div
					animate={scrolledToBottom && !isLoading ? "visible" : "hidden"}
					variants={{
						visible: {
							height: "auto",
							opacity: 1,
							transition: {
								height: { duration: 0.4, delay: 0.0 },
								opacity: { duration: 0.3, delay: 0.0 }
							}
						},
						hidden: {
							height: 0,
							opacity: 0,
							transition: {
								height: { duration: 0.3, delay: 0.0 },
								opacity: { duration: 0.2, delay: 0.0 }
							}
						}
					}}
					initial="hidden"
					className="overflow-hidden"
			>
					<div className="grid sm:grid-cols-2 gap-2 w-full">
						{starters?.map((suggestion, index) => (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={{ duration: 1.0, delay: 0.05 * index }}
								key={index}
								className={index > 1 ? "hidden sm:block" : "block"}
							>
								<Button
									variant="suggestion"
									onClick={(event) => {
										event.preventDefault();
										window.history.replaceState({}, "", `/chat/${chatId}`);

										append({
											role: "user",
											content: suggestion,
										});
									}}
									className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-full justify-left items-start whitespace-normal break-words"
									disabled={isLoading}
								>
									<span className="my-auto">{suggestion}</span>
								</Button>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}

			{/* <input
				type="file"
				className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
				ref={fileInputRef}
				multiple
				// onChange={handleFileChange}
				tabIndex={-1}
			/> */}

			{/* {(attachments.length > 0 || uploadQueue.length > 0) && (
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
			)} */}

			<Textarea
				maxLength={1024}
				ref={textareaRef}
				placeholder="Ask about anything..."
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

			{/* <Button
				className="rounded-full p-1.5 h-fit absolute bottom-2 right-11 m-0.5 dark:border-zinc-700"
				onClick={(event) => {
					event.preventDefault();
					fileInputRef.current?.click();
				}}
				variant="outline"
				disabled={isLoading}
			>
				<PaperclipIcon size={14} />
			</Button> */}
		</div>
	);
}
