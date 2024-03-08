"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { useAuth } from "@clerk/nextjs";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDrawerState } from "../login/state";
import { UseChatHelpers } from "ai/react";
import { ChatTarget, useChatState } from "./state";
import { s } from "vitest/dist/reporters-rzC174PQ.js";

type Props = {
	target: ChatTarget;
	placeholders: string[] | string;
	trackingKey: string;
	authRequired?: boolean;
};

export function ChatInput(props: Props) {
	const { target, placeholders, trackingKey, authRequired } = props;

	const [input, setInput] = useState("");
	const { questions, loading, appendQuestion } = useChatState(target);

	// TODO: Fix return url
	const { userId } = useAuth();
	const { open } = useDrawerState();

	const trackAndInvoke = (event: FormEvent<HTMLFormElement>) => {
		Tracker.track(trackingKey, {
			text: input,
		});

		appendQuestion(input);
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
	authRequired?: boolean;
};

export function ChatInputOld(props: ChatInputOldProps) {
	const { chat, placeholder, trackingKey, authRequired } = props;
	const { input, isLoading, handleInputChange, handleSubmit } = chat;

	// TODO: Fix return url
	const { userId } = useAuth();
	const { open } = useDrawerState();

	const trackAndInvoke = (event: FormEvent<HTMLFormElement>) => {
		Tracker.track(trackingKey, {
			text: input,
		});

		handleSubmit(event);
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
				/>
			</form>
		</div>
	);
}
