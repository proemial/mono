"use client";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { ChatInput } from "@/app/components/chat/chat-input";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export function AskInput() {
	const [value, setValue] = useState("");
	const router = useRouter();

	return (
		<ChatInput
			value={value}
			placeholder="Ask anything"
			trackingKey={analyticsKeys.ask.submit.ask}
			onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
			onSubmit={(e) => {
				e.preventDefault();
				router.push(`/?q=${value}`);
			}}
		/>
	);
}
