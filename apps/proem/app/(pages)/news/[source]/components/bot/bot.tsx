import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { useChat } from "ai/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useFromFeedSearchParam } from "../../../components/use-published";
import { BotQa } from "./bot-qa";
import { users } from "../../../components/users";
import { BotForm } from "./bot-form";
import { BotSuggestion } from "./bot-suggestion";
import { useInitialMessages } from "./initial-messages";
import { DummyButton, getRandomUserSeed } from "./fake-it";
import { BotHeader, FactualHeader } from "./headers";
import { JSONValue } from "ai";

type Props = {
	url: string;
	questions?: Array<[string, string]>;
};

export function Bot({ url, questions }: Props) {
	const { fromFeedParam: isFromFeed } = useFromFeedSearchParam();
	const initialMessages = useInitialMessages(questions, isFromFeed);

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		append,
		isLoading,
		data,
	} = useChat({
		api: "/api/news/bot",
		initialMessages,
		id: url,
		keepLastMessageOnError: true,
		body: {
			url,
		},
	});

	const followups = useFollowups(data);

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

	// For now using a placeholder title since we don't have access to it
	const rndUser = getRandomUserSeed(url, users);

	return (
		<>
			<FactualHeader />
			<div
				id="askform"
				className="flex-col pb-2 items-start gap-2 self-stretch w-full flex-[0_0_auto] flex relative overflow-hidden"
			>
				<BotForm
					handleSubmitWithInputCheck={(e) => handleSubmitWithInputCheck(e)}
					handleInputChange={(e) => handleInputChange(e)}
					input={input}
					url={url}
				/>

				<BotHeader />

				<div className="flex-col items-start gap-2 pl-[58px] pr-3 py-0 w-full flex">
					{questions?.slice(isFromFeed ? 3 : 0).map((qa, index) => (
						<BotSuggestion
							key={index}
							qa={qa}
							isLoading={isLoading}
							isAsked={isAlreadyAsked(qa.at(0))}
							handleSuggestionClick={handleSuggestionClick}
						/>
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

							const followupMatches = followups?.find(
								(f) => f.question === message.content,
							);

							return (
								<BotQa
									key={index}
									user={
										index < 6 && isFromFeed
											? users.at(Math.floor(rndUser + index / 2))
											: undefined
									}
									question={message.content}
									answer={messages.at(index + 1)?.content}
									followups={followupMatches?.followups}
									id={`qa-${index}`}
								/>
							);
						})}
					</div>

					<DummyButton isFromFeed={isFromFeed} url={url} />
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
function useFollowups(data?: JSONValue[]) {
	const [followups, setFollowups] =
		useState<
			{
				question: string;
				answer: string;
				followups: string[];
			}[]
		>();

	useEffect(() => {
		type StreamingData = { type: string; value: string };
		const followupsObject = (data as StreamingData[])
			?.filter((d) => d.type === "followups")
			?.reduce(
				(acc, d) => {
					const { question, answer, followups } = JSON.parse(d.value);
					acc.push({ question, answer, followups });
					return acc;
				},
				[] as { question: string; answer: string; followups: string[] }[],
			);

		setFollowups(followupsObject);
	}, [data]);

	return followups;
}
