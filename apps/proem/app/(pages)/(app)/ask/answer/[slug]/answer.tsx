"use client";
import {
	QaPair,
	QaPairProps,
} from "@/app/(pages)/(app)/ask/answer/[slug]/qa-pair";
import {
	AnswerEngineEvents,
	findByEventType,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";
import { useUser } from "@/app/hooks/use-user";
import { USER_QUESTIONS_QUERY_KEY } from "@/app/profile/profile-questions";
import { ChatInput } from "../../components/chat-input";
import { ChatSuggestedFollowups } from "../../components//chat-suggested-followups";
import { routes } from "@/routes";
import { cn } from "@proemial/shadcn-ui";
import { useQueryClient } from "@tanstack/react-query";
import { Message, useChat } from "ai/react";
import { useEffect, useState } from "react";

type Props = Pick<QaPairProps, "bookmarks"> & {
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
	bookmarks,
}: Props) => {
	const [sessionSlug, setSessionSlug] = useState<string | undefined>(
		initialSessionSlug,
	);
	const queryClient = useQueryClient();
	const { user } = useUser();
	const { messages, data, append, isLoading, stop, error } = useChat({
		sendExtraMessageFields: true,
		id: initialQuestion,
		api: "/api/bot/ask3",
		initialMessages,
		onFinish: () => {
			queryClient.invalidateQueries({
				queryKey: [USER_QUESTIONS_QUERY_KEY],
			});
		},
		body: { slug: sessionSlug, userId: user?.id },
		keepLastMessageOnError: true,
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
			window.history.pushState(null, "", `${routes.answer}/${sessionSlug}`);
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
		<div className="flex flex-col justify-between flex-grow gap-4 relative pt-4">
			<div className={cn("flex flex-col gap-10")}>
				{messages.map((message, index) => {
					if (message.role !== "user") {
						return undefined;
					}
					return (
						<QaPair
							bookmarks={bookmarks}
							key={message.id}
							question={message}
							answer={getAnswerMessage(index, messages)}
							data={answerEngineData}
							className={cn({
								"opacity-0 pointer-events-none": showInputMode,
							})}
							followUps={FollowUpComponent}
							isLatest={
								message === messages.filter((m) => m.role === "user").at(-1)
							}
							error={error}
						/>
					);
				})}
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

/**
 * Get the last answer message that correspond to a given user message.
 */
const getAnswerMessage = (userMessageIndex: number, messages: Message[]) => {
	const answerMessages: Message[] = [];
	for (let i = userMessageIndex; i < messages.length; i++) {
		const message = messages[i + 1];
		if (message && message.role === "assistant") {
			answerMessages.push(message);
		} else {
			break;
		}
	}
	// Note: We _could_ return all the `assistant` messages, but decided not to
	// shown intermediate steps (i.e. all but the last one).
	return answerMessages.at(-1);
};

/**
 * This works under the assumption that there is only _one_ answer message per
 * user message.
 */
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
