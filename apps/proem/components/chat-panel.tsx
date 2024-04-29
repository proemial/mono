"use client";
import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
import { screenMaxWidth } from "@/app/constants";
import { ChatInput } from "@/components/chat-input";
import { SelectContentSelector } from "@/components/select-content-selector";
import { Suggestions } from "@/components/suggestions";

export interface ChatPanelProps {
	state: "empty" | "inprogress" | "follow-up-ask" | "follow-up-discover";
	trackingPrefix: string;
}

/**
 * @deprecated: Kept for styling reference - throw away if you want :3
 */
export function ChatPanel({ state, trackingPrefix }: ChatPanelProps) {
	const suggestions = [
		"Does organic farming produce more greenhouse gasses?",
		"How can I lower my blood pressure?",
		"Have low-fat diets increased obesity?",
	];

	return (
		<div
			className={`${screenMaxWidth} z-10 w-full mx-auto overflow-visible ${
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
							trackingKey={`${trackingPrefix}:${analyticsKeys.chat.click.suggestionsCategory}`}
						/>
					</div>
					<Suggestions
						suggestions={suggestions}
						trackingPrefix={trackingPrefix}
					/>
				</>
			)}
			{state === "empty" && (
				<ChatInput
					placeholder="Ask a question"
					trackingPrefix={trackingPrefix}
				/>
			)}
			{state === "follow-up-ask" && (
				<ChatInput
					placeholder="Ask follow-up..."
					trackingPrefix={trackingPrefix}
				/>
			)}
			{state === "follow-up-discover" && (
				<ChatInput
					placeholder="Ask this paper..."
					trackingPrefix={trackingPrefix}
				/>
			)}
		</div>
	);
}
