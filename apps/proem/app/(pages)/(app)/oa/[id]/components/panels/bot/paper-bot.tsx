"use client";
import { Spinner } from "@/app/components/spinner";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { useChat } from "ai/react";
import React from "react";
import { BotForm } from "./components/bot-form";
import { BotMessages } from "./components/bot-messages";

type Props = {
	paper: OpenAlexPaper;
	starters: string[];
};

export function PaperBot({ paper, starters }: Props) {
	const { title, abstract } = paper.data;

	const { messages, input, handleInputChange, handleSubmit, append } = useChat({
		body: { title, abstract, model: "gpt-3.5-turbo" },
		api: "/api/bot/chat",
	});

	return (
		<div className="flex flex-col h-full">
			{!starters && (
				<div className="mb-4">
					<Spinner />
				</div>
			)}

			{starters && (
				<BotMessages messages={messages} starters={starters} append={append} />
			)}

			<div className="fixed left-0 w-full bg-black bottom-14 shadow-top">
				<div className="w-full max-w-screen-md px-4 py-3 mx-auto">
					<BotForm
						value={input}
						onChange={handleInputChange}
						onSubmit={handleSubmit}
					/>
				</div>
			</div>
		</div>
	);
}
