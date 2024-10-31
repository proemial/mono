import { NewsItem } from "@proemial/adapters/redis/news";
import { BotQa } from "./bot-qa";
import { Message, nanoid } from "ai";
import { useChat } from "ai/react";
import { cn } from "@proemial/shadcn-ui";
import { ArrowRight } from "@untitled-ui/icons-react";
import { FormEvent, useCallback } from "react";
import { Avatar } from "../../../components/avatars";
import { Trackable } from "@/components/trackable";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";

const users = [
	{
		image: "https://randomuser.me/api/portraits/med/men/12.jpg",
		name: "James Anderson",
		time: "3h",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/5.jpg",
		name: "Sarah Mitchell",
		time: "5h",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/8.jpg",
		name: "Robert Wilson",
		time: "1d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/15.jpg",
		name: "Emily Parker",
		time: "2d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/3.jpg",
		name: "David Thompson",
		time: "3d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/9.jpg",
		name: "Jessica Brown",
		time: "4d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/17.jpg",
		name: "William Davis",
		time: "5d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/2.jpg",
		name: "Rachel Moore",
		time: "1w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/6.jpg",
		name: "Thomas Martin",
		time: "1w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/18.jpg",
		name: "Laura Wilson",
		time: "2w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/14.jpg",
		name: "Christopher Lee",
		time: "2w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/11.jpg",
		name: "Amanda White",
		time: "3w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/19.jpg",
		name: "Daniel Clark",
		time: "3w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/7.jpg",
		name: "Michelle Taylor",
		time: "4w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/4.jpg",
		name: "Kevin Walker",
		time: "1m",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/13.jpg",
		name: "Jennifer Adams",
		time: "1m",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/10.jpg",
		name: "Brian Miller",
		time: "2m",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/20.jpg",
		name: "Lisa Johnson",
		time: "2m",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/1.jpg",
		name: "Mark Robinson",
		time: "3m",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/16.jpg",
		name: "Katherine Hall",
		time: "3m",
	},
];

export function Bot({
	url,
	questions,
}: { url: string; questions?: Array<[string, string]> }) {
	const initialMessages: Message[] = [
		{
			role: "user",
			content: questions?.at(0)?.at(0) ?? "",
			id: nanoid(),
		},
		{
			role: "assistant",
			content: questions?.at(0)?.at(1) ?? "",
			id: nanoid(),
		},
		{
			role: "user",
			content: questions?.at(1)?.at(0) ?? "",
			id: nanoid(),
		},
		{
			role: "assistant",
			content: questions?.at(1)?.at(1) ?? "",
			id: nanoid(),
		},
		{
			role: "user",
			content: questions?.at(2)?.at(0) ?? "",
			id: nanoid(),
		},
		{
			role: "assistant",
			content: questions?.at(2)?.at(1) ?? "",
			id: nanoid(),
		},
	];

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		append,
		isLoading,
	} = useChat({
		api: "/api/news/bot",
		initialMessages,
		id: url,
		keepLastMessageOnError: true,
		body: {
			url,
		},
	});

	const isAlreadyAsked = useCallback(
		(suggestion: string | undefined) => {
			return messages.some((message) => message.content === suggestion);
		},
		[messages],
	);

	const handleSubmitWithInputCheck = async (
		event: FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault();
		// Model fails if input is empty
		if (input.trim().length > 0) {
			handleSubmit();
			await scrollToQa(messages.length.toString());
			trackHandler(analyticsKeys.experiments.news.item.qa.submitAskInput, {
				sourceUrl: url ?? "",
			})();
		}
	};

	const handleSuggestionClick = async (suggestion: string | undefined) => {
		if (suggestion) {
			append({
				role: "user",
				content: suggestion,
			});
			await scrollToQa(messages.length.toString());
		}
	};

	return (
		<>
			<div
				id="askform"
				className="flex-col pb-2 items-start gap-2 self-stretch w-full flex-[0_0_auto] flex relative overflow-hidden"
			>
				<div className="items-center gap-1.5 px-3 py-0 flex w-full">
					<Avatar seed="6" />

					<form onSubmit={handleSubmitWithInputCheck} className="flex w-full">
						<div className="w-full bg-gray-200 h-10 px-3 rounded-xl mt-0.5 text-[15px] flex gap-2 items-center">
							<Trackable
								trackingKey={
									analyticsKeys.experiments.news.item.qa.clickAskInputField
								}
								properties={{ sourceUrl: url ?? "" }}
							>
								<input
									id="bot-input"
									placeholder="Ask a question"
									value={input}
									onChange={handleInputChange}
									className="w-full h-full bg-transparent outline-none placeholder:text-[#999999]"
								/>
							</Trackable>
							<button type="submit" className="text-gray-400">
								<ArrowRight className="size-5" />
							</button>
						</div>
					</form>
				</div>

				<div className="flex pl-[62px]">
					<p className="relative w-fit  font-medium text-[#757989] text-xs tracking-[0] leading-5 whitespace-nowrap">
						Suggested questions
					</p>
				</div>

				<div className="flex-col items-start gap-2 pl-[50px] pr-3 py-0 w-full flex">
					{questions?.slice(3).map((qa, index) => (
						<Trackable
							key={index}
							trackingKey={
								analyticsKeys.experiments.news.item.qa.clickSuggestedQuestion
							}
							properties={{ question: qa.at(0) ?? "" }}
						>
							<button
								disabled={isLoading || isAlreadyAsked(qa.at(0))}
								type="button"
								onClick={() => handleSuggestionClick(qa.at(0))}
								className={cn(
									"bg-[#e9eaee] text-[#08080a] rounded-xl gap-2 py-2 px-3 flex justify-between items-center text-left text-[15px] w-full",
									{
										"hover:bg-[#e9eaee]  cursor-pointer":
											!isLoading && !isAlreadyAsked(qa.at(0)),
										"text-gray-400 cursor-not-allowed":
											isLoading || isAlreadyAsked(qa.at(0)),
									},
								)}
							>
								<div>{qa.at(0)}</div>
								<div>
									<ArrowRight className="size-5 opacity-25" />
								</div>
							</button>
						</Trackable>
					))}
				</div>
			</div>
			<div className="flex items-center justify-end gap-2 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<div className="items-center gap-2 flex-1 grow flex relative">
					<div className="relative w-fit mt-[-1.00px] font-semibold text-[#0a161c] text-lg tracking-[0] leading-4 whitespace-nowrap">
						Top questions
					</div>
				</div>
			</div>
			<div className="flex flex-col-reverse items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
				{messages.map((message, index) => {
					if (message.role === "assistant") return null;
					return (
						<BotQa
							key={index}
							user={index < 6 ? users.at(Math.floor(index / 2)) : undefined}
							qa={[message.content, messages.at(index + 1)?.content ?? ""]}
							id={`qa-${index}`}
						/>
					);
				})}
			</div>
		</>
	);
}

const scrollToQa = async (index: string) => {
	await new Promise((resolve) => setTimeout(resolve, 100));
	document.getElementById(`qa-${index}`)?.scrollIntoView({
		behavior: "smooth",
		block: "center",
	});
};
