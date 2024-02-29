import { Tracker } from "@/app//components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { limit } from "@proemial/utils/array";
import { Message as AiMessage } from "ai";
import { UseChatHelpers } from "ai/react";
import { MutableRefObject, useEffect, useRef } from "react";
import { Message } from "./message";
import { Starter } from "./starter";
import { useUser } from "@clerk/nextjs";
import { getProfileFromUser } from "@/app/(pages)/(app)/profile/profile-from-user";
import { ScrollToBottom } from "@/app/components/proem-ui/scroll-to-top-bottom";

type Props = Pick<UseChatHelpers, "append"> & {
	messages: AiMessage[];
	starters: string[];
};

export function BotMessages({ messages, starters, append }: Props) {
	const { user } = useUser();
	const userProfile = getProfileFromUser(user);
	const chatWrapperRef = useRef<HTMLInputElement>(null);

	const appendQuestion = (question: string) =>
		append({ role: "user", content: question });

	const handleExplainerClick = (msg: string) => {
		Tracker.track(analyticsKeys.read.click.explainer, { msg });
		appendQuestion(`What is ${msg}?`);
	};

	const handleStarterClick = (question: string) => {
		Tracker.track(analyticsKeys.read.click.starter, { question });
		appendQuestion(question);
	};

	useEffect(() => {
		if (messages?.length > 0 && chatWrapperRef.current) {
			chatWrapperRef.current.scrollIntoView(false);
		}
	}, [messages]);

	return (
		<div className="flex flex-col justify-end" ref={chatWrapperRef}>
			{messages.length === 0 &&
				// TODO! Filter out empty strings as a hack for now until the data consistensy is fixed
				limit(starters?.filter(Boolean), 3).map((question) => (
					<Starter key={question} onClick={() => handleStarterClick(question)}>
						{question}
					</Starter>
				))}

			<div className="flex flex-col gap-3 ">
				{messages?.map((message, i) => (
					<Message
						key={i}
						message={message}
						user={userProfile}
						onExplainerClick={handleExplainerClick}
					/>
				))}
			</div>
		</div>
	);
}
