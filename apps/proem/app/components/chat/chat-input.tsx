"use client";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { ChangeEvent, FormEvent } from "react";

type Props = {
	input: string;
	placeholder: string;
	onSubmit: (e: FormEvent<HTMLFormElement>) => void;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
};

export default function ChatInput(props: Props) {
	const { input, disabled, placeholder, onSubmit, onChange } = props;

	const trackAndInvoke = (event: FormEvent<HTMLFormElement>) => {
		Tracker.track(analyticsKeys.ask.submit.ask, {
			text: input,
		});

		onSubmit(event);
	};

	return (
		<div className="relative w-full">
			<form
				className="flex flex-row items-center"
				onSubmit={(event) => trackAndInvoke(event)}
			>
				<TextInput
					value={input}
					onChange={onChange}
					disabled={disabled}
					placeholder={placeholder}
				/>
			</form>
		</div>
	);
}
