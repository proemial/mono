"use client";
import { QaPair } from "@/app/(pages)/(app)/(ask)/answer/[slug]/qa-pair";
import {
	AnswerEngineEvents,
	findByEventType,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";
import { useUser } from "@/app/hooks/use-user";
import { USER_QUESTIONS_QUERY_KEY } from "@/app/profile/profile-questions";
import { ChatInput } from "@/components/chat-input";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { cn } from "@proemial/shadcn-ui";
import { Message, useChat } from "ai/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

type Props = {
	initialQuestion?: string;
	initialSessionSlug?: string;
	initialMessages?: Message[];
	existingData?: AnswerEngineEvents[];
};

export const Answer = ({
	initialQuestion,
	initialMessages,
	initialSessionSlug,
	existingData,
}: Props) => {
	const [sessionSlug, setSessionSlug] = useState<string | undefined>(
		initialSessionSlug,
	);
	const queryClient = useQueryClient();
	const { user } = useUser();
	const { messages, data, append, isLoading, stop } = useChat({
		sendExtraMessageFields: true,
		id: initialQuestion,
		api: "/api/bot/ask2",
		initialMessages,
		onFinish: () => {
			queryClient.invalidateQueries(USER_QUESTIONS_QUERY_KEY);
		},
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

	useEffect(() => {
		if (initialQuestion && sessionSlug) {
			// Replacing url without reloading the page with a server call
			window.history.pushState(null, "", `/answer/${sessionSlug}`);
		}
	}, [sessionSlug, initialQuestion]);

	const [isFocused, setIsFocused] = useState(false);
	const handleFocusChange = (isFocused: boolean) => {
		setIsFocused(isFocused);
	};

	const showInputMode = isFocused && !isLoading;
	const followUps = getFollowUps(answerEngineData);
	const FollowUpComponent = (
		<ChatSuggestedFollowups
			suggestions={followUps}
			onClick={append}
			trackingPrefix="ask"
		/>
	);

	return (
		<div className="flex flex-col justify-between flex-grow gap-4 relative">
			<div className={cn("flex flex-col gap-10")}>
				{messages
					.filter((message) => message.role === "user")
					.map((message, index) => (
						<QaPair
							key={message.id}
							question={message}
							answer={getCorrespondingAnswerMessage(index, messages)}
							data={answerEngineData}
							className={cn({
								"opacity-0 pointer-events-none": showInputMode,
							})}
							followUps={FollowUpComponent}
							isLatest={index === Math.ceil(messages.length / 2) - 1}
						/>
					))}
			</div>
			{showInputMode && (
				<div className="sticky bottom-32">{FollowUpComponent}</div>
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
