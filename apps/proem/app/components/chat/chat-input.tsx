"use client";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

type Props = {
	handleSubmit?: (e: FormEvent<HTMLFormElement>) => void;
	input?: string;
	handleInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	placeholder?: string;
};

export default function ChatInput({
	handleSubmit,
	input,
	handleInputChange,
	disabled,
	placeholder,
}: Props) {
	const [searchValue, setSearchValue] = useState("");
	const router = useRouter();

	const trackAndInvoke = (event: FormEvent<HTMLFormElement>) => {
		Tracker.track(analyticsKeys.ask.submit.ask, {
			text: input ? input : searchValue,
		});

		handleSubmit
			? handleSubmit(event)
			: () => {
					event.preventDefault();
					router.push(`/search?q=${searchValue}`);
			  };
	};

	return (
		<div className="relative w-full">
			<form
				className="flex flex-row items-center"
				onSubmit={(event) => trackAndInvoke(event)}
			>
				<TextInput
					value={input ? input : searchValue}
					onChange={
						handleInputChange
							? handleInputChange
							: (e) => setSearchValue(e.target.value)
					}
					disabled={disabled}
					placeholder={placeholder}
				/>
			</form>
		</div>
	);
}
