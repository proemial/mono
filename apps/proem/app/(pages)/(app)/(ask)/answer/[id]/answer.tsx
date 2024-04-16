"use client";

import {
	AnswerEngineEvents,
	findByEventType,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useUser } from "@/app/hooks/use-user";
import { ChatForm } from "@/components/chat-form";
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
	existingShareId,
	existingData,
}: Props) => {
	const [sessionSlug, setSessionSlug] = useState<string | undefined>(undefined);
	const { user } = useUser();
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		data,
		append,
		isLoading,
	} = useChat({
		sendExtraMessageFields: true,
		id: "hardcoded",
		api: "/api/bot/ask2",
		initialMessages,
		body: { slug: sessionSlug, userId: user?.id },
	}) as Omit<ReturnType<typeof useChat>, "data"> & {
		data: AnswerEngineEvents[];
	};
	const answerEngineData = existingData
		? [...existingData, ...(data ? data : [])]
		: data;

	useEffectOnce(() => {
		if (initialQuestion) {
			append({ role: "user", content: initialQuestion });
		}
	}, [initialQuestion, append]);

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

	const followUps = getFollowUps(answerEngineData);

	return (
		<div className="flex flex-col gap-10">
			{messages
				.filter((message) => message.role === "user")
				.map((message, index) => (
					<QaPair
						key={message.id}
						question={message}
						answer={getCorrespondingAnswerMessage(index, messages)}
						data={answerEngineData}
						loading={
							isLoading && !getCorrespondingAnswerMessage(index, messages)
						}
					/>
				))}
			{!isLoading && (
				<div className="space-y-2">
					<ChatSuggestedFollowups suggestions={followUps} onClick={append} />
					<ChatForm placeholder="Ask a follow-up question…" onClick={append} />
				</div>
			)}
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
