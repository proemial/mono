"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { ChangeEvent, FormEvent } from "react";

type Props = {
	value: string;
	placeholder: string;
	onSubmit: (e: FormEvent<HTMLFormElement>) => void;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	trackingKey: string;
	disabled?: boolean;
};

export default function ChatInput(props: Props) {
	const { value, placeholder, onSubmit, onChange, trackingKey, disabled } =
		props;

	const trackAndInvoke = (event: FormEvent<HTMLFormElement>) => {
		Tracker.track(trackingKey, {
			text: value,
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
					value={value}
					onChange={onChange}
					disabled={disabled}
					placeholder={placeholder}
				/>
			</form>
		</div>
	);
}
