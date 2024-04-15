"use client";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import { useInputFocusState } from "@/app/components/chat/state";
import { useDrawerState } from "@/app/components/login/state";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { useAuth } from "@clerk/nextjs";
import { UseChatHelpers } from "ai/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export function AskInput() {
	const [input, setInput] = useState("");
	const router = useRouter();

	const chat = {
		input,
		handleSubmit: (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			router.push(`/?q=${input}`);
		},
		handleInputChange: (
			e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
		) => setInput(e.target.value),
		isLoading: false,
	};

	return (
		<ChatInputOld
			chat={chat}
			placeholder="Ask anything"
			trackingKey={analyticsKeys.ask.submit.ask}
		/>
	);
}

type Props = {
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

function ChatInputOld(props: Props) {
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