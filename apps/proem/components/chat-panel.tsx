"use client";

import { ChatForm } from "@/components/chat-form";
import { SelectContentSelector } from "@/components/select-content-selector";
import { Suggestions } from "@/components/suggestions";

export interface ChatPanelProps {
	state: "empty" | "inprogress" | "follow-up-ask" | "follow-up-discover";
}

export function ChatPanel({ state }: ChatPanelProps) {
	const suggestions = [
		"Does organic farming produce more greenhouse gasses?",
		"How can I lower my blood pressure?",
		"Have low-fat diets increased obesity?",
	];

	return (
		<div
			className={`z-10 w-full max-w-screen-md mx-auto overflow-visible ${
				state === "empty" ? "fixed inset-x-0 bottom-0" : "flex flex-col"
			}`}
		>
			{state === "empty" && (
				<>
					<div className="place-self-end">
						<SelectContentSelector
							selector={[
								{ value: "popular", label: "Popular" },
								{ value: "trending", label: "Trending" },
								{ value: "curious", label: "Curious" },
							]}
						/>
					</div>
					<Suggestions suggestions={suggestions} />
				</>
			)}
			{state === "empty" && <ChatForm placeholder="Ask a question" />}
			{state === "follow-up-ask" && <ChatForm placeholder="Ask follow-up..." />}
			{state === "follow-up-discover" && (
				<ChatForm placeholder="Ask this paper..." />
			)}
		</div>
	);
}
