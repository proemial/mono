"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { useAuth } from "@clerk/nextjs";
import { ChangeEvent, FormEvent } from "react";
import { useDrawerState } from "../login/state";
import { UseChatHelpers } from "ai/react";

type Props = {
	placeholder: string;
	trackingKey: string;
	authRequired?: boolean;
};

export function ChatInput(props: Props) {
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
