import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { JSONValue } from "ai";
import { Message, useChat } from "ai/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useFromFeedSearchParam } from "../../../components/use-published";
import { BotForm } from "./bot-form";
import { BotSuggestion } from "./bot-suggestion";
import { CommunityQuestions } from "./fake-it";
import { BotHeader } from "./headers";
import { BotQa } from "./bot-qa";
import { Throbber } from "@/components/throbber";

type Props = {
	url: string;
	questions: Array<[string, string]>;
};

export function Bot({ url, questions }: Props) {
	const { fromFeedParam: isFromFeed } = useFromFeedSearchParam();

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
		id: url,
		keepLastMessageOnError: true,
		body: {
			url,
		},
	});

	const suggestions = useSuggestions(questions, data, isFromFeed);

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
			{messages?.length > 0 && (
				<div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
					{messages.map((message, index) => {
						if (message.role === "assistant") return null;

						return (
							<BotQa
								key={index}
								question={message.content}
								answer={messages.at(index + 1)?.content}
								scrollTo={index === messages.length - 1}
							/>
						);
					})}
				</div>
			)}

			<BotHeader />

			<div
				id="askform"
				className="flex-col pb-2 items-start gap-2 self-stretch w-full flex-[0_0_auto] flex relative overflow-hidden"
			>
				<div
					className="flex-col items-start gap-2 px-3 py-0 w-full flex"
					style={{
						maxHeight: !isLoading ? "1000px" : "0px",
						transition: "all 0.6s ease-in-out",
						overflow: "hidden",
					}}
				>
					{suggestions?.map((qa, index) => (
						<BotSuggestion
							key={index}
							qa={[qa, ""]}
							isLoading={isLoading}
							isAsked={isAlreadyAsked(qa.at(0))}
							handleSuggestionClick={handleSuggestionClick}
						/>
					))}
				</div>

				<BotForm
					handleSubmitWithInputCheck={(e) => handleSubmitWithInputCheck(e)}
					handleInputChange={(e) => handleInputChange(e)}
					input={input}
					url={url}
				/>
			</div>

			<CommunityQuestions
				questions={questions}
				isFromFeed={isFromFeed}
				url={url}
			/>
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

function useSuggestions(
	questions: Array<[string, string]>,
	// messages: Message[],
	data?: JSONValue[],
	isFromFeed?: boolean,
) {
	const [followups, setFollowups] = useState<
		{
			question: string;
			answer: string;
			followups: string[];
		}[]
	>(initialSuggestions(questions, isFromFeed) ?? []);

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

		if (followupsObject?.length) {
			setFollowups(followupsObject);
		}
	}, [data]);

	// const currentQuestion = messages
	// 	.filter((m) => m.role === "user")
	// 	.at(-1)?.content;

	// return currentQuestion
	// 	? followups.find((f) => f.question === currentQuestion)?.followups
	// 	: followups.at(-1)?.followups;
	return followups.at(-1)?.followups;
}

function initialSuggestions(
	questions?: Array<[string, string]>,
	isFromFeed?: boolean,
) {
	const tripple = isFromFeed ? questions?.slice(3) : questions?.slice(0, 3);
	return [
		{
			question: "",
			answer: "",
			followups: tripple?.map((qa) => qa.at(0) ?? "") ?? [],
		},
	];
}
