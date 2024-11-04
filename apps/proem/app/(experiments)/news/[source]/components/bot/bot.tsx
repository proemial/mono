import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { cn } from "@proemial/shadcn-ui";
import { ArrowRight } from "@untitled-ui/icons-react";
import { Message, nanoid } from "ai";
import { useChat } from "ai/react";
import { FormEvent, useCallback, useMemo } from "react";
import { Avatar } from "../../../components/avatars";
import { useFromFeedSearchParam } from "../../../components/use-published";
import { BotQa } from "./bot-qa";
import { users } from "../../../components/users";

type Props = {
	url: string;
	questions?: Array<[string, string]>;
};

export function Bot({ url, questions }: Props) {
	const { fromFeedParam: isFromFeed } = useFromFeedSearchParam();

	const initialMessages: Message[] = useMemo(
		() =>
			isFromFeed
				? [
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
					]
				: [],
		[isFromFeed, questions],
	);

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

	const getRandomUserSeed = (title: string) => {
		// Create a consistent hash from the title
		let hash = 0;
		for (let i = 0; i < title.length; i++) {
			hash = (hash << 5) - hash + title.charCodeAt(i);
			hash = hash & hash; // Convert to 32-bit integer
		}
		// return random-looking but consistent user number
		return Math.abs(hash % (users.length - 3));
	};

	// For now using a placeholder title since we don't have access to it
	const rndUser = getRandomUserSeed(url);

	return (
		<>
			<div className="flex items-center justify-end gap-2 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<div className="items-center gap-2 flex-1 grow flex relative">
					<div className="relative w-fit mt-[-1.00px] font-semibold text-[#0a161c] text-lg tracking-[0] leading-4 whitespace-nowrap">
						Get Answers Backed by Science
					</div>
				</div>
			</div>
			<div
				id="askform"
				className="flex-col pb-2 items-start gap-2 self-stretch w-full flex-[0_0_auto] flex relative overflow-hidden"
			>
				<div className="items-center gap-1.5 px-3 py-0 flex w-full">
					<Avatar seed="6" />

					<form onSubmit={handleSubmitWithInputCheck} className="flex w-full">
						<div className="w-full bg-white h-10 px-3 rounded-xl mt-0.5 text-[15px] flex gap-2 items-center border border-gray-400">
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

				<div className="flex-col items-start gap-2 pl-[58px] pr-3 py-0 w-full flex">
					{questions?.slice(isFromFeed ? 3 : 0).map((qa, index) => (
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
									"bg-white text-[#08080a] rounded-xl gap-2 py-2 px-3 flex justify-between items-center text-left text-[15px] w-full border border-gray-400",
									{
										"hover:bg-[#e9eaee] hover:border-[#e9eaee]   cursor-pointer":
											!isLoading && !isAlreadyAsked(qa.at(0)),
										"text-gray-400 border-gray-200 cursor-not-allowed":
											isLoading || isAlreadyAsked(qa.at(0)),
									},
								)}
							>
								<div>{qa.at(0)}</div>
								<div>
									<ArrowRight className="size-5 opacity-50" />
								</div>
							</button>
						</Trackable>
					))}
				</div>
			</div>
			{messages.length > 0 && (
				<div className="flex flex-col gap-3">
					{messages.length <= 6 && isFromFeed && (
						<div className="font-semibold text-[#0a161c] text-lg tracking-[0] leading-4 whitespace-nowrap px-3 pb-2">
							Top questions
						</div>
					)}
					<div className="flex flex-col-reverse items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
						{messages.map((message, index) => {
							if (message.role === "assistant") return null;
							return (
								<BotQa
									key={index}
									user={
										index < 6 && isFromFeed
											? users.at(Math.floor(rndUser + index / 2))
											: undefined
									}
									qa={[message.content, messages.at(index + 1)?.content ?? ""]}
									id={`qa-${index}`}
								/>
							);
						})}
					</div>
					{isFromFeed && (
						<div className="flex text-center items-center w-full m-2 justify-center">
							<Trackable
								trackingKey={
									analyticsKeys.experiments.news.item.qa.clickShowMore
								}
								properties={{ sourceUrl: url }}
							>
								<div className="inline-flex h-8 gap-1 px-3 py-2 rounded-[19px] border border-solid active:bg-theme-600 hover:cursor-pointer">
									<div className="inline-flex gap-1.5 relative">
										<div className="relative w-fit mt-[-1.00px] font-normal text-[13px] tracking-[0] leading-[normal] select-none">
											Show more
										</div>
									</div>
								</div>
							</Trackable>
						</div>
					)}
				</div>
			)}
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
