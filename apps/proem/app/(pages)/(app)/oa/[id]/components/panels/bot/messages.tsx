import { Tracker } from "@/app//components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { limit } from "@proemial/utils/array";
import { Message as AiMessage } from "ai";
import { UseChatHelpers } from "ai/react";
import { MutableRefObject } from "react";
import { Message, Question } from "./message";

type Props = Pick<UseChatHelpers, "append"> & {
	messages: AiMessage[];
	starters: string[];
	chatWrapperRef: MutableRefObject<HTMLInputElement | null>;
};

export function BotMessages({
	messages,
	starters,
	append,
	chatWrapperRef,
}: Props) {
	const appendQuestion = (question: string) =>
		append({ role: "user", content: question });

	const explainConcept = (msg: string) => {
		Tracker.track(analyticsKeys.read.click.explainer, { msg });
		appendQuestion(`What is ${msg}?`);
	};

	const handleSuggestionClick = (question: string) => {
		Tracker.track(analyticsKeys.read.click.starter, { question });
		appendQuestion(question);
	};

	return (
		<div
			className="flex flex-col justify-end pb-14 scroll-mb-14"
			ref={chatWrapperRef}
		>
			{messages.length === 0 &&
				// TODO! Filter out empty strings as a hack for now until the data consistensy is fixed
				limit(starters?.filter(Boolean), 3).map((question) => (
					<Question
						key={question}
						onClick={() => handleSuggestionClick(question)}
						starter
					>
						{question}
					</Question>
				))}
			{messages?.map((message, i) => (
				<Message
					key={i}
					role={message.role}
					content={message.content}
					explain={explainConcept}
				/>
			))}

			{/* Will scroll user to bottom after scroll up */}
			{/* <ScrollToBottom /> */}
		</div>
	);
}
