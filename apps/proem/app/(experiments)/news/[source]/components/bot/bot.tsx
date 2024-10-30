import { NewsItem } from "@proemial/adapters/redis/news";
import { BotQa } from "./bot-qa";
import { Message, nanoid } from "ai";
import { useChat } from "ai/react";
import { Button, Input } from "@proemial/shadcn-ui";

const users = [
	{
		image: "https://randomuser.me/api/portraits/med/men/1.jpg",
		name: "Michael Lajlev",
		time: "6h",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/2.jpg",
		name: "Mads Rydahl",
		time: "2d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/1.jpg",
		name: "Lene Hansen",
		time: "1w",
	},
];

export function Bot({ data }: { data?: NewsItem }) {
	const initialMessages: Message[] = [
		{
			role: "user",
			content: data?.generated?.questions.at(0)?.at(0) ?? "",
			id: nanoid(),
		},
		{
			role: "assistant",
			content: data?.generated?.questions.at(0)?.at(1) ?? "",
			id: nanoid(),
		},
		{
			role: "user",
			content: data?.generated?.questions.at(1)?.at(0) ?? "",
			id: nanoid(),
		},
		{
			role: "assistant",
			content: data?.generated?.questions.at(1)?.at(1) ?? "",
			id: nanoid(),
		},
		{
			role: "user",
			content: data?.generated?.questions.at(2)?.at(0) ?? "",
			id: nanoid(),
		},
		{
			role: "assistant",
			content: data?.generated?.questions.at(2)?.at(1) ?? "",
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
		api: "/api/news",
		initialMessages,
		keepLastMessageOnError: true,
		body: {
			item: data,
		},
	});

	const handleSuggestionClick = (suggestion: string | undefined) => {
		if (suggestion) {
			append({
				role: "user",
				content: suggestion,
			});
		}
	};

	return (
		<>
			<div className="flex-col pb-2 items-start gap-2 self-stretch w-full flex-[0_0_auto] flex relative overflow-hidden">
				<div className="items-center gap-1.5 px-3 py-0 flex w-full">
					<div className="flex items-center gap-1">
						<img
							className="relative object-cover w-8 h-8 rounded-full"
							alt=""
							src="https://randomuser.me/api/portraits/med/men/4.jpg"
						/>
					</div>

					<form onSubmit={handleSubmit} className="flex w-full">
						<input
							value={input}
							onChange={handleInputChange}
							className="w-full bg-gray-200 h-10 px-2 rounded-md mt-0.5"
						/>
					</form>
				</div>

				<div className="flex items-center gap-1.5 relative pl-[62px]">
					<p className="relative w-fit mt-[-1.00px] font-medium text-[#757989] text-xs tracking-[0] leading-5 whitespace-nowrap">
						Suggested questions
					</p>
				</div>

				<div className="flex-col items-start gap-2 pl-[50px] pr-3 py-0 w-full flex">
					{data?.generated?.questions.slice(3).map((qa, index) => (
						<Button
							key={index}
							onClick={() => handleSuggestionClick(qa.at(0))}
							className="bg-gray-200 hover:bg-gray-300"
						>
							{qa.at(0)}
						</Button>
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
			<div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
				{messages.map((message, index) => {
					if (message.role === "assistant") return null;
					return (
						<BotQa
							key={index}
							user={
								users.at(Math.floor(index / 2)) ?? {
									image: "https://randomuser.me/api/portraits/med/men/4.jpg",
									name: "You",
									time: "now",
								}
							}
							qa={[message.content, messages.at(index + 1)?.content ?? ""]}
						/>
					);
				})}
			</div>
		</>
	);
}
