"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { useAuth } from "@clerk/nextjs";
import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import { useDrawerState } from "../login/state";
import { UseChatHelpers } from "ai/react";
import { ChatTarget, useChatState, useInputFocusState } from "./state";
import { analyticsKeys } from "../analytics/analytics-keys";

type Props = {
	target: ChatTarget;
	children?: ReactNode;
};

export function ChatInput({ target, children }: Props) {
	const [input, setInput] = useState("");
	const { placeholders, trackingKey, readonly, onFocus } =
		useInputState(target);
	const { questions, loading, appendQuestion, setFocus } = useChatState(target);

	const trackAndInvoke = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		Tracker.track(trackingKey, {
			text: input,
		});

		appendQuestion(input);
		setInput("");
	};

	const handleFocusChange = (isFocused: boolean) => {
		setFocus(isFocused);
	};

	const placeholder =
		Array.isArray(placeholders) &&
			placeholders.length > 1 &&
			questions.length > 0
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
				/>
			</form>
		</div>
	);
}

function useInputState(target: ChatTarget) {
	const isRead = target === "paper";

	const placeholders = isRead
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

type ChatInputOldProps = {
	chat: Required<
		Pick<
			UseChatHelpers,
			"input" | "isLoading" | "handleInputChange" | "handleSubmit"
		>
	>;
	placeholder: string;
	trackingKey: string;
	onFocusChange?: (isFocused: boolean) => void;
	authRequired?: boolean;
};

export function ChatInputOld(props: ChatInputOldProps) {
	const { chat, placeholder, trackingKey, authRequired } = props;
	const { input, isLoading, handleInputChange, handleSubmit } = chat;
	const { setFocus } = useInputFocusState();

	// TODO: Fix return url
	const { userId } = useAuth();
	const { open } = useDrawerState();

	const trackAndInvoke = (event: FormEvent<HTMLFormElement>) => {
		Tracker.track(trackingKey, {
			text: input,
		});

		handleSubmit(event);
		props.onFocusChange?.(false);
		// setFocus(false);
	};

	const handleFocusChange = (isFocused: boolean) => {
		setFocus(isFocused);
		props.onFocusChange?.(isFocused);
	};

	return (
		<div className="relative w-full">
			<form
				className="flex flex-row items-center"
				onSubmit={(event) => trackAndInvoke(event)}
			>
				<TextInput
					value={input}
					placeholder={placeholder}
					onChange={handleInputChange}
					disabled={isLoading}
					readonly={authRequired && !userId}
					onFocus={() => authRequired && !userId && open()}
					onFocusChange={handleFocusChange}
				/>
			</form>
		</div>
	);
}
