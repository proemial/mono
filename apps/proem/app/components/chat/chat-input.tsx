"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { useAuth } from "@clerk/nextjs";
import { ChangeEvent, FormEvent } from "react";
import { useDrawerState } from "../login/state";

type Props = {
	placeholder: string;
	trackingKey: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: FormEvent<HTMLFormElement>) => void;
	value?: string;
	disabled?: boolean;
	authRequired?: boolean;
};

export function ChatInput(props: Props) {
	const {
		value,
		placeholder,
		onSubmit,
		onChange,
		trackingKey,
		disabled,
		authRequired,
	} = props;

	// TODO: Fix return url
	const { userId } = useAuth();
	const { open } = useDrawerState();

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
					placeholder={placeholder}
					onChange={onChange}
					disabled={disabled}
					readonly={authRequired && !userId}
					onFocus={() => authRequired && !userId && open()}
				/>
			</form>
		</div>
	);
}
