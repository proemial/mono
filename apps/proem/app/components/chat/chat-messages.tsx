import { getProfileFromUser } from "@/app/(pages)/(app)/profile/profile-from-user";
import { Tracker } from "@/app//components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { useUser } from "@clerk/nextjs";
import { Message as AiMessage } from "ai";
import { UseChatHelpers } from "ai/react";
import { useEffect, useRef } from "react";
import { ChatMessage, ChatStarter } from "./chat-message";
import { limit } from "@proemial/utils/array";

type Props = Pick<UseChatHelpers, "append"> & {
	messages: AiMessage[];
	starters: string[];
};

export function ChatMessages({ messages, starters, append }: Props) {
	const { user } = useUser();
	const userProfile = getProfileFromUser(user);

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

	return (
		<>
			{messages.length === 0 &&
				// TODO! Filter out empty strings as a hack for now until the data consistensy is fixed
				limit(starters?.filter(Boolean), 3).map((question) => (
					<ChatStarter
						key={question}
						onClick={() => handleStarterClick(question)}
					>
						{question}
					</ChatStarter>
				))}

			<div className="flex flex-col justify-end gap-4">
				{messages?.map((message, i) => (
					<ChatMessage
						key={i}
						message={message}
						user={userProfile}
						onExplainerClick={handleExplainerClick}
					/>
				))}
			</div>
		</>
	);
}
