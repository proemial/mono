"use client";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { ChatInputOld } from "@/app/components/chat/chat-input";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

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
