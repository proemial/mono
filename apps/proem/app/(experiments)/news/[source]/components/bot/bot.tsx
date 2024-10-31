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
		name: "Jolly Jaguar",
		avatar: "🐆",
		backgroundColor: "#000000",
		time: "3h",
	},
	{
		name: "Bouncy Beaver",
		avatar: "🦫",
		backgroundColor: "#FFDAB9",
		time: "2d",
	},
	{
		name: "Sneaky Squirrel",
		avatar: "🐿️",
		backgroundColor: "#87CEEB",
		time: "7d",
	},
	{
		name: "Dazzling Dolphin",
		avatar: "🐬",
		backgroundColor: "#FF4500",
		time: "9h",
	},
	{
		name: "Witty Walrus",
		avatar: "🦭",
		backgroundColor: "#FFFF00",
		time: "4h",
	},
	{ name: "Zany Zebra", avatar: "🦓", backgroundColor: "#1E90FF", time: "1d" },
	{
		name: "Mighty Moose",
		avatar: "🦌",
		backgroundColor: "#FFD700",
		time: "5d",
	},
	{
		name: "Curious Cheetah",
		avatar: "🐆",
		backgroundColor: "#000000",
		time: "8h",
	},
	{ name: "Nifty Newt", avatar: "🦎", backgroundColor: "#FF4500", time: "6h" },
	{
		name: "Giggly Giraffe",
		avatar: "🦒",
		backgroundColor: "#00008B",
		time: "3d",
	},
	{
		name: "Charming Chimp",
		avatar: "🐒",
		backgroundColor: "#4682B4",
		time: "4d",
	},
	{ name: "Eager Eagle", avatar: "🦅", backgroundColor: "#D3D3D3", time: "2h" },
	{ name: "Brave Bear", avatar: "🐻", backgroundColor: "#FFE4E1", time: "5h" },
	{
		name: "Happy Hedgehog",
		avatar: "🦔",
		backgroundColor: "#87CEFA",
		time: "6d",
	},
	{
		name: "Speedy Sloth",
		avatar: "🦥",
		backgroundColor: "#FAFAD2",
		time: "7h",
	},
	{
		name: "Gentle Gazelle",
		avatar: "🦌",
		backgroundColor: "#00008B",
		time: "8d",
	},
	{
		name: "Silly Seahorse",
		avatar: "🐡",
		backgroundColor: "#FFA07A",
		time: "1h",
	},
	{ name: "Bold Bison", avatar: "🦬", backgroundColor: "#FFFACD", time: "9d" },
	{
		name: "Fancy Flamingo",
		avatar: "🦩",
		backgroundColor: "#8A2BE2",
		time: "4h",
	},
	{
		name: "Lively Llama",
		avatar: "🦙",
		backgroundColor: "#2F4F4F",
		time: "3d",
	},
	{
		name: "Cool Crocodile",
		avatar: "🐊",
		backgroundColor: "#FFD700",
		time: "5h",
	},
	{ name: "Wise Wolf", avatar: "🐺", backgroundColor: "#87CEEB", time: "2d" },
	{
		name: "Peppy Penguin",
		avatar: "🐧",
		backgroundColor: "#FFFFE0",
		time: "6h",
	},
	{
		name: "Rambunctious Raccoon",
		avatar: "🦝",
		backgroundColor: "#ADD8E6",
		time: "7d",
	},
	{
		name: "Playful Panda",
		avatar: "🐼",
		backgroundColor: "#ADD8E6",
		time: "8h",
	},
	{ name: "Tiny Turtle", avatar: "🐢", backgroundColor: "#FF69B4", time: "9h" },
	{
		name: "Swift Sparrow",
		avatar: "🐦",
		backgroundColor: "#8B4513",
		time: "1d",
	},
	{
		name: "Gentle Giant",
		avatar: "🐘",
		backgroundColor: "#2F4F4F",
		time: "2h",
	},
	{
		name: "Jumping Jackal",
		avatar: "🦊",
		backgroundColor: "#00CED1",
		time: "3d",
	},
	{
		name: "Marvelous Manta",
		avatar: "🐋",
		backgroundColor: "#FFFF00",
		time: "4h",
	},
	{
		name: "Quiet Quokka",
		avatar: "🦘",
		backgroundColor: "#2E8B57",
		time: "5d",
	},
	{ name: "Vivid Viper", avatar: "🐍", backgroundColor: "#FFD700", time: "6h" },
	{
		name: "Radiant Rabbit",
		avatar: "🐰",
		backgroundColor: "#FF1493",
		time: "7d",
	},
	{ name: "Sly Skunk", avatar: "🦨", backgroundColor: "#FF4500", time: "8h" },
	{
		name: "Spritely Salmon",
		avatar: "🐟",
		backgroundColor: "#B22222",
		time: "9h",
	},
	{
		name: "Sparkly Starling",
		avatar: "🐦",
		backgroundColor: "#A0522D",
		time: "1d",
	},
	{ name: "Feisty Fox", avatar: "🦊", backgroundColor: "#00CED1", time: "2h" },
	{
		name: "Cheery Chicken",
		avatar: "🐔",
		backgroundColor: "#00CED1",
		time: "3d",
	},
	{ name: "Keen Koala", avatar: "🐨", backgroundColor: "#4B0082", time: "4h" },
	{ name: "Sunny Swan", avatar: "🦢", backgroundColor: "#8B0000", time: "5d" },
	{
		name: "Whimsical Whale",
		avatar: "🐋",
		backgroundColor: "#FFD700",
		time: "6h",
	},
	{
		name: "Proud Peacock",
		avatar: "🦚",
		backgroundColor: "#D2691E",
		time: "7d",
	},
	{ name: "Loyal Lion", avatar: "🦁", backgroundColor: "#4682B4", time: "8h" },
	{ name: "Eager Emu", avatar: "🦆", backgroundColor: "#FFE4B5", time: "9h" },
	{
		name: "Friendly Ferret",
		avatar: "🦡",
		backgroundColor: "#F0E68C",
		time: "1d",
	},
	{
		name: "Joyful Jellyfish",
		avatar: "🐙",
		backgroundColor: "#00CED1",
		time: "2h",
	},
	{ name: "Bright Bat", avatar: "🦇", backgroundColor: "#FFFFE0", time: "3d" },
	{
		name: "Merry Meerkat",
		avatar: "🦒",
		backgroundColor: "#4B0082",
		time: "4h",
	},
	{
		name: "Noble Narwhal",
		avatar: "🐳",
		backgroundColor: "#FFD700",
		time: "5d",
	},
	{
		name: "Chirpy Chipmunk",
		avatar: "🐿️",
		backgroundColor: "#FFB6C1",
		time: "6h",
	},
	{
		name: "Gallant Goose",
		avatar: "🦆",
		backgroundColor: "#FFD700",
		time: "7d",
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
				sourceUrl: url,
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
								properties={{ sourceUrl: url }}
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
