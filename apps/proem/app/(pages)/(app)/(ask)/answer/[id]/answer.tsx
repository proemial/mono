"use client";

import {
	AnswerEngineEvents,
	findByEventType,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";
import { useUser } from "@/app/hooks/use-user";
import { ChatInput } from "@/components/chat-input";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { Message, useChat } from "ai/react";
import { useEffect, useState } from "react";
import { QaPair } from "./qa-pair";
import { useEffectOnce } from "./use-effect-once";

type Props = {
	initialQuestion?: string;
	initialMessages?: Message[];
	existingShareId?: string;
	existingData?: AnswerEngineEvents[];
};

export const Answer = ({
	initialQuestion,
	initialMessages,
	existingData,
}: Props) => {
	const [sessionSlug, setSessionSlug] = useState<string | undefined>(undefined);
	const { user } = useUser();
	const { messages, data, append, isLoading, stop } = useChat({
		sendExtraMessageFields: true,
		id: initialQuestion,
		api: "/api/bot/ask2",
		initialMessages,
		body: { slug: sessionSlug, userId: user?.id },
	}) as Omit<ReturnType<typeof useChat>, "data"> & {
		data: AnswerEngineEvents[];
	};
	const answerEngineData = existingData
		? [...existingData, ...(data ? data : [])]
		: data;

	useRunOnFirstRender(() => {
		if (initialQuestion && messages.length === 0) {
			append({ role: "user", content: initialQuestion });
		}
	});

	const answerSlug = findByEventType(
		answerEngineData,
		"answer-slug-generated",
	)?.slug;

	useEffect(() => {
		// Keep slug from first answer
		if (answerSlug && !sessionSlug) {
			setSessionSlug(answerSlug);
		}
	});

	const [isFocused, setIsFocused] = useState(false);
	const handleFocusChange = (isFocused: boolean) => {
		setIsFocused(isFocused);
	};

	const followUps = getFollowUps(answerEngineData);

	return (
		<div className="flex flex-col justify-between flex-grow gap-4">
			{(!isFocused || isLoading) && (
				<div className="flex flex-col gap-10">
					{messages
						.filter((message) => message.role === "user")
						.map((message, index) => (
							<QaPair
								key={message.id}
								question={message}
								answer={getCorrespondingAnswerMessage(index, messages)}
								data={answerEngineData}
								followUps={
									<ChatSuggestedFollowups
										suggestions={followUps}
										onClick={append}
										trackingPrefix="ask"
									/>
								}
								isLatest={index === Math.ceil(messages.length / 2) - 1}
							/>
						))}
				</div>
			)}

			{isFocused && !isLoading && (
				<div className="flex flex-col justify-end flex-grow">
					<ChatSuggestedFollowups
						suggestions={followUps}
						onClick={append}
						trackingPrefix="ask"
					/>
				</div>
			)}

			<ChatInput
				placeholder="Ask a follow-up question…"
				onSend={append}
				isLoading={isLoading}
				stop={stop}
				onFocusChange={handleFocusChange}
				trackingPrefix="ask"
			/>
		</div>
	);
};

const getCorrespondingAnswerMessage = (
	questionMessageIndex: number,
	messages: Message[],
) => {
	const answerMessageIndex = questionMessageIndex * 2 + 1;
	return messages[answerMessageIndex];
};

const getFollowUps = (data: AnswerEngineEvents[]) =>
	findLatestByEventType(data, "follow-up-questions-generated")
		.hits.at(0)
		?.map((hit) => hit.question) ?? [];
