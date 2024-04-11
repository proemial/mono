"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { useAuth } from "@clerk/nextjs";
import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import { analyticsKeys } from "../analytics/analytics-keys";
import { useDrawerState } from "../login/state";
import { ChatTarget, useChatState } from "./state";
import { chatInputMaxLength } from "@/app/api/bot/input-limit";

type Props = {
	target: ChatTarget;
	children?: ReactNode;
};

export function ChatInput({ target, children }: Props) {
	const [input, setInput] = useState("");
	const { placeholders, trackingKey, readonly, onFocus } =
		useInputState(target);
	const { question, loading, addQuestion, setFocus } = useChatState(target);

	const trackAndInvoke = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		Tracker.track(trackingKey, {
			text: input,
		});

		addQuestion(input);
		setInput("");
	};

	const handleFocusChange = (isFocused: boolean) => {
		setFocus(isFocused);
	};

	// I know, this will always be the first element in the array. To be fixed in the next UI iteration.
	const placeholder =
		Array.isArray(placeholders) && placeholders.length > 1 && question
			? placeholders[1]
			: placeholders[0];

	return (
		<div className="relative w-full">
			{children}
			<form
				className="flex flex-row items-center"
				onSubmit={(event) => trackAndInvoke(event)}
			>
				<TextInput
					value={input}
					placeholder={placeholder as string}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setInput(event.target.value)
					}
					disabled={loading}
					readonly={readonly}
					onFocus={() => !!onFocus && onFocus()}
					onFocusChange={handleFocusChange}
					maxLength={chatInputMaxLength}
				/>
			</form>
		</div>
	);
}

function useInputState(target: ChatTarget) {
	const isRead = target === "paper";

	const placeholders: [emptyPlaceholder: string, followUpPLaceholder: string] =
		isRead
			? ["Ask a question about this paper", "Ask a follow-up question"]
			: ["Ask anything", "Ask a follow-up question"];

	const trackingKey = isRead
		? analyticsKeys.read.submit.question
		: analyticsKeys.ask.submit.ask;

	const { userId } = useAuth();
	const readonly = isRead && !userId;

	const { open } = useDrawerState();
	const onFocus = isRead && !userId && open;

	return { placeholders, trackingKey, readonly, onFocus };
}
