"use client";
import { Search } from "lucide-react";
import { Tracker } from "../analytics/tracker";
import { ChatTarget, useChatState } from "./state";
import { ChatStarter } from "./chat-message";
import { limit } from "@proemial/utils/array";
import { analyticsKeys } from "../analytics/analytics-keys";
import { useEffect } from "react";
import { ASK_STARTERS } from "./ask-starters";

type Props = {
	target: ChatTarget;
};

export function StarterMessages({ target }: Props) {
	const { questions, appendQuestion } = useChatState(target);

	const trackingKey =
		target === "ask"
			? analyticsKeys.ask.click.share
			: analyticsKeys.read.click.share;

	if (questions?.length > 0) {
		return null;
	}

	const trackAndInvoke = (text: string) => {
		Tracker.track(trackingKey, {
			text,
		});

		appendQuestion(text);
	};

	return (
		<>
			{questions.length > 0 && (
				<>
					<div className="flex items-center font-sourceCodePro">
						<Search
							style={{ height: "12px", strokeWidth: "3" }}
							className="w-4"
						/>
						SUGGESTED QUESTIONS
					</div>
					{questions.map((question) => (
						<ChatStarter
							key={question}
							onClick={() => trackAndInvoke(question)}
						>
							{question}
						</ChatStarter>
					))}
				</>
			)}
		</>
	);
}
