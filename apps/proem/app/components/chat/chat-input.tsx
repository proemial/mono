"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { useAuth } from "@clerk/nextjs";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDrawerState } from "../login/state";
import { UseChatHelpers } from "ai/react";
import { ChatTarget, useChatState, useInputFocusState } from "./state";

type Props = {
	target: ChatTarget;
	placeholders: string[] | string;
	trackingKey: string;
	authRequired?: boolean;
};

export function ChatInput(props: Props) {
	const { target, placeholders, trackingKey, authRequired } = props;

	const [input, setInput] = useState("");
	const { questions, loading, appendQuestion, setFocus } = useChatState(target);

	// TODO: Fix return url
	const { userId } = useAuth();
	const { open } = useDrawerState();

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
					readonly={authRequired && !userId}
					onFocus={() => authRequired && !userId && open()}
					onFocusChange={handleFocusChange}
				/>
			</form>
		</div>
	);
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
