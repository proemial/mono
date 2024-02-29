"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { Send } from "@/app/components/icons/functional/send";
import { useDrawerState } from "@/app/components/login/state";
import { Button } from "@/app/components/shadcn-ui/button";
import { useAuth } from "@clerk/nextjs";
import { ChangeEvent, FormEvent } from "react";

type Props = {
	value: string;
	placeholder: string;
	onSubmit: (e: FormEvent<HTMLFormElement>) => void;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	trackingKey: string;
	disabled?: boolean;
};

export function BotForm(props: Props) {
	const { value, placeholder, onSubmit, onChange, trackingKey } = props;

	const { userId } = useAuth();
	const { open } = useDrawerState();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		Tracker.track(trackingKey);
		onSubmit(e);
	};

	return (
		<div className="relative w-full">
			<form onSubmit={handleSubmit} className="flex flex-row items-center">
				<input
					readOnly={!userId}
					onFocus={() => !userId && open()}
					type="text"
					placeholder={placeholder}
					className="flex w-full h-[42px] text-[16px] font-normal rounded bg-[#1A1A1A] border border-[#4E4E4E] text-white placeholder-green-500 px-3 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 relative break-words stretch"
					value={value}
					onChange={onChange}
				/>
				<Button
					variant="send_button"
					size="sm"
					type="submit"
					className="absolute items-center justify-center bg-transparent right-2"
				>
					<Send />
				</Button>
			</form>
		</div>
	);
}
