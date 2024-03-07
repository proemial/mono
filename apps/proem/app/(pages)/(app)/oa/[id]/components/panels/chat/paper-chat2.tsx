"use client";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { useChat } from "ai/react";
import React from "react";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { ChatInput } from "@/app/components/chat/chat-input";
import {
	ChatMessages,
	StarterMessages,
} from "@/app/components/chat/chat-messages";

type Props = {
	paper: OpenAlexPaper;
	starters: string[];
};

export function PaperChat2({ paper, starters }: Props) {
	const { title, abstract } = paper.data;

	const chat = useChat({
		body: { title, abstract, model: "gpt-3.5-turbo" },
		api: "/api/bot/chat",
	});

	const initialPlaceholder =
		chat.messages.length === 0 || (chat.isLoading && chat.messages.length < 3);

	const result = [
		<StarterMessages starters={starters} chat={chat} />,
		<ChatMessages chat={chat} />,
		<ChatInput
			chat={chat}
			placeholder={
				initialPlaceholder
					? "Ask a question about this paper"
					: "Ask a follow-up question"
			}
			trackingKey={analyticsKeys.read.submit.question}
			authRequired
		/>,
	];

	console.log("result", result);

	return [null, null, null];
}
