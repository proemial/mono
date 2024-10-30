import { NewsItem } from "@proemial/adapters/redis/news";
import { BotQa } from "./bot-qa";
import { Message, nanoid } from "ai";
import { useChat } from "ai/react";
import { cn } from "@proemial/shadcn-ui";
import { ArrowRight } from "@untitled-ui/icons-react";
import { useCallback } from "react";
import { Avatar } from "../../../components/avatars";

const users = [
	{
		image: "https://2.gravatar.com/avatar/1b71ebb39f67bb39f33f588a20b7360ff815208089dc35e85bab38321654339d?size=256",
		name: "Michael Lajlev",
		time: "6h",
	},
	{
		image: "https://0.gravatar.com/avatar/e8e8ab7b6985e308725f05d247803c1ccd3bd4decaf1a798fb3c4285adc8251f?size=256",
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

	const isAlreadyAsked = useCallback(
		(suggestion: string | undefined) => {
			return messages.some((message) => message.content === suggestion);
		},
		[messages],
	);

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
					<Avatar seed="brian" />

					<form onSubmit={handleSubmit} className="flex w-full">
						<input
							placeholder="Ask a question"
							value={input}
							onChange={handleInputChange}
							className="w-full bg-gray-200 h-10 px-2 rounded-xl mt-0.5 text-[15px] focus:bg-white"
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
						<button
							key={index}
							disabled={isLoading || isAlreadyAsked(qa.at(0))}
							type="button"
							onClick={() => handleSuggestionClick(qa.at(0))}
							className={cn(
								"bg-[#e9eaee] rounded-xl py-2 px-3 flex justify-between items-center text-left text-[15px] w-full",
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
