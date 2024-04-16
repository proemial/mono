"use client";

import {
	AnswerEngineEvents,
	findByEventType,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useUser } from "@/app/hooks/use-user";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { Message, useChat } from "ai/react";
import { useEffect, useState } from "react";
import { QaPair } from "./qa-pair";
import { useEffectOnce } from "./use-effect-once";

type Props = {
	initialQuestion: string;
};

export const Answer = ({ initialQuestion }: Props) => {
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
		body: { slug: sessionSlug, userId: user?.id },
	});

	useEffectOnce(() => {
		if (initialQuestion) {
			append({ role: "user", content: initialQuestion });
		}
	}, [initialQuestion, append]);

	const answerSlug = findByEventType(
		data as AnswerEngineEvents[],
		"answer-slug-generated",
	)?.slug;
	useEffect(() => {
		// Keep slug from first answer
		if (answerSlug && !sessionSlug) {
			setSessionSlug(answerSlug);
		}
	});

	const followUps = getFollowUps(data);

	return (
		<div className="flex flex-col gap-10">
			{messages
				.filter((message) => message.role === "user")
				.map((message, index) => (
					<QaPair
						key={message.id}
						question={message}
						answer={getCorrespondingAnswerMessage(index, messages)}
						data={data}
						loading={
							isLoading && !getCorrespondingAnswerMessage(index, messages)
						}
					/>
				))}
			{!isLoading && (
				<>
					<ChatSuggestedFollowups suggestions={followUps} onClick={append} />
					<ButtonScrollToBottom />
				</>
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

const getFollowUps = (data: ReturnType<typeof useChat>["data"]) =>
	findLatestByEventType(
		data as AnswerEngineEvents[],
		"follow-up-questions-generated",
	)
		.hits.at(0)
		?.map((hit) => hit.question) ?? [];
