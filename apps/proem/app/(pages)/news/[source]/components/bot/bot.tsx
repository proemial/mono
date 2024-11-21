import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { Message, useChat } from "ai/react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useFromFeedSearchParam } from "../../../components/use-published";
import { BotForm } from "./bot-form";
import { BotQa } from "./bot-qa";
import { BotSuggestion } from "./bot-suggestion";
import { CommunityQuestions } from "./fake-it";
import { BotHeader } from "./headers";
import { ReferencedPaper } from "@proemial/adapters/redis/news";

type StreamingData = { type: string; value: string };

type Props = {
	url: string;
	starters: Array<[string, string]>;
};

export function Bot({ url, starters }: Props) {
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
		keepLastMessageOnError: true,
		body: {
			url,
		},
	});

	const { suggestions, hidden } = useSuggestions(
		starters,
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
			{messages?.map((message, index) => {
				if (message.role === "assistant") return null;

				const question = message.content;
				const answers = findAnswers(index, messages);
				const events = findMessageEvents(question, data as StreamingData[]);

				const papers = events?.["retrieval-end"]?.papers;

				return (
					<BotQa
						key={index}
						question={question}
						answer={answers.at(-1)?.content}
						papers={papers}
						user={{ name: "You" }}
						scrollTo={index === messages.length - 1}
					/>
				);
			})}

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
				questions={starters}
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

function findAnswers(index: number, messages: Message[]) {
	const answers: Message[] = [];

	let i = 1;
	while (i < 10) {
		// Safety limit of 10 messages
		const nextMessage = messages[index + i] as Message | undefined;
		if (!nextMessage || nextMessage.role !== "assistant") break;

		answers.push(nextMessage);
		i++;
	}

	return answers;
}

function findMessageEvents(question: string, data?: StreamingData[]) {
	console.log("[findMessageEvents]", question, data);
	return data
		?.map(({ type, value }) => {
			const { question, ...rest } = JSON.parse(value);
			const papers = rest.papers ? JSON.parse(rest.papers) : undefined;

			return { type, question, papers };
		})
		.filter((d) => d.question === question)
		?.reduce(
			(acc, d, index) => {
				acc[d.type] = JSON.parse(JSON.stringify({ ...d, index }));
				return acc;
			},
			{} as Record<
				string,
				{
					type: string;
					question: string;
					papers?: Array<ReferencedPaper>;
					index: number;
				}
			>,
		);
}

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
			if (memoizedData?.type === "followups-begin") setHidden(true);

			if (memoizedData?.type === "followups-end") {
				setTimeout(() => {
					setSuggestions(JSON.parse(memoizedData.value).followups);
					setHidden(false);
				}, 1000);
			}
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
