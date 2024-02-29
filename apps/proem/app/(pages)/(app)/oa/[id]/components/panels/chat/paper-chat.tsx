"use client";
import { Spinner } from "@/app/components/spinner";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { useChat } from "ai/react";
import React from "react";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { ChatInput } from "@/app/components/chat/chat-input";
import { ChatMessages } from "@/app/components/chat/chat-messages";

type Props = {
	paper: OpenAlexPaper;
	starters: string[];
};

export function PaperChat({ paper, starters }: Props) {
	const { title, abstract } = paper.data;

	const { messages, input, handleInputChange, handleSubmit, append } = useChat({
		body: { title, abstract, model: "gpt-3.5-turbo" },
		api: "/api/bot/chat",
	});

	const chatWrapperRef = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		if (messages?.length > 0 && chatWrapperRef.current) {
			chatWrapperRef.current.scrollIntoView(false);
		}
	}, [messages]);

	return (
		<div className="flex flex-col scroll-mb-96" ref={chatWrapperRef}>
			{!starters && (
				<div className="mb-4">
					<Spinner />
				</div>
			)}

			{starters && (
				<>
					<div>
						<ChatMessages
							messages={messages}
							starters={starters}
							append={append}
						/>
					</div>
				</>
			)}

			<div className="fixed left-0 w-full bg-black bottom-14 shadow-top">
				<div className="w-full max-w-screen-md px-4 py-3 mx-auto">
					<ChatInput
						value={input}
						placeholder="Ask your own question about this paper"
						onChange={handleInputChange}
						onSubmit={handleSubmit}
						trackingKey={analyticsKeys.read.submit.question}
						authRequired
					/>
				</div>
			</div>
		</div>
	);
}
