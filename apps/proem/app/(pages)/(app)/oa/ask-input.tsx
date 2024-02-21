"use client";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";

export function AskInput() {
	return (
		<form
			className="flex flex-row items-center"
			action="/"
			method="get"
			onSubmit={() => {
				Tracker.track(analyticsKeys.read.submit.ask);
			}}
		>
			<TextInput />
		</form>
	);
}
