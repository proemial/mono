"use client";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useState } from "react";
import { useFeatureFlags } from "../../feature-flags/client-flags";
import { dislike, like } from "./actions";

type Feedback = "like" | "dislike";

export interface FeedbackButtonsProps {
	runId: string | undefined;
}

export const FeedbackButtons = ({ runId }: FeedbackButtonsProps) => {
	const [feedbackState, setFeedbackState] = useState<Feedback>();
	const flags = useFeatureFlags(["showAnswerFeedbackButtons"]);

	const colors = {
		like: feedbackState === "like" ? "text-green-400" : "",
		dislike: feedbackState === "dislike" ? "text-red-300" : "",
	};

	const handleFeedback = (feedback: Feedback) => () => {
		if (feedback === "like" && feedbackState !== "like") {
			setFeedbackState("like");
			like(runId);
		} else if (feedback === "dislike" && feedbackState !== "dislike") {
			setFeedbackState("dislike");
			dislike(runId);
		}
	};

	if (!flags.showAnswerFeedbackButtons || !runId) {
		return undefined;
	}

	return (
		<div className="flex gap-1">
			<ThumbsUpIcon
				size="18"
				className={`duration-200 cursor-pointer hover:text-green-500 ${colors.like}`}
				onClick={handleFeedback("like")}
			/>
			<ThumbsDownIcon
				size="18"
				className={`duration-200 cursor-pointer hover:text-red-400 ${colors.dislike}`}
				onClick={handleFeedback("dislike")}
			/>
		</div>
	);
};
