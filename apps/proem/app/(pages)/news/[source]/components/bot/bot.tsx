import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { useChat } from "ai/react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useFromFeedSearchParam } from "../../../components/use-published";
import { BotForm } from "./bot-form";
import { BotQa } from "./bot-qa";
import { BotSuggestion } from "./bot-suggestion";
import { CommunityQuestions } from "./fake-it";
import { BotHeader } from "./headers";

type StreamingData = { type: string; value: string };

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

	const { suggestions, hidden } = useSuggestions(
		questions,
		data as StreamingData[],
		isFromFeed,
	);

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
				<div className="flex relative flex-col gap-4 items-start self-stretch w-full">
					{messages.map((message, index) => {
						if (message.role === "assistant") return null;

						return (
							<BotQa
								key={index}
								question={message.content}
								answer={messages.at(index + 1)?.content}
								scrollTo={index === messages.length - 1}
								isLoading={isLoading}
							/>
						);
					})}
				</div>
			)}

			<div
				id="askform"
				className="flex overflow-hidden relative flex-col gap-2 items-start self-stretch pb-2 mt-4 w-full"
			>
				<BotHeader />
				<div
					className="flex flex-col gap-2 items-start pt-3 w-full"
					style={{
						maxHeight: hidden ? "0px" : "1000px",
						transition: "all 0.9s ease-in-out",
						overflow: "hidden",
					}}
				>
					{suggestions?.map((qa, index) => (
						<BotSuggestion
							key={index}
							qa={[qa, ""]}
							isLoading={isLoading || hidden}
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
	if (typeof document === "undefined") return;

	await new Promise((resolve) => setTimeout(resolve, 100));
	document.getElementById(`qa-${index}`)?.scrollIntoView({
		behavior: "smooth",
		block: "center",
	});
};

function useSuggestions(
	questions: Array<[string, string]>,
	data?: StreamingData[],
	isFromFeed?: boolean,
) {
	const memoizedData = useMemo(() => data?.at(-1) as StreamingData, [data]);
	const [hidden, setHidden] = useState(false);
	const [suggestions, setSuggestions] = useState(
		initialSuggestions(questions, isFromFeed).followups,
	);
	useEffect(() => {
		if (memoizedData) {
			setHidden(memoizedData?.type === "followups");

			setTimeout(() => {
				setSuggestions(JSON.parse(memoizedData.value).followups);
				setHidden(false);
			}, 1000);
		}
	}, [memoizedData]);

	return { suggestions, hidden };
}

function initialSuggestions(
	questions?: Array<[string, string]>,
	isFromFeed?: boolean,
) {
	const tripple = isFromFeed ? questions?.slice(3) : questions?.slice(0, 3);
	return {
		question: "",
		answer: "",
		followups: tripple?.map((qa) => qa.at(0) ?? "") ?? [],
	};
}
