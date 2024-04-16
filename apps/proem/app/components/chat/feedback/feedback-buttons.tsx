"use client";

import { dislike, like } from "@/app/components/chat/feedback/actions";
import { useFeatureFlags } from "@/app/components/feature-flags/client-flags";
import { cn } from "@/app/components/shadcn-ui/utils";
import { ThumbsDown, ThumbsUp } from "@untitled-ui/icons-react";
import { useState } from "react";

type Feedback = "like" | "dislike";

export interface FeedbackButtonsProps {
	runId: string | undefined;
}

export const FeedbackButtons = ({ runId }: FeedbackButtonsProps) => {
	const [feedbackState, setFeedbackState] = useState<Feedback>();
	const flags = useFeatureFlags(["showAnswerFeedbackButtons"]);

	if (!flags.showAnswerFeedbackButtons || !runId) {
		return null;
	}

	const handleFeedback = (feedback: Feedback) => () => {
		if (feedback === "like" && feedbackState !== "like") {
			setFeedbackState("like");
			like(runId);
		} else if (feedback === "dislike" && feedbackState !== "dislike") {
			setFeedbackState("dislike");
			dislike(runId);
		}
	};

	return (
		<div className="flex gap-1">
			<ThumbsUp
				className={cn("duration-200", {
					"text-green-400": feedbackState === "like",
					"hover:text-green-500 cursor-pointer": feedbackState !== "like",
				})}
				onClick={handleFeedback("like")}
			/>

			<ThumbsDown
				className={cn("duration-200", {
					"text-red-300": feedbackState === "dislike",
					"hover:text-red-400 cursor-pointer": feedbackState !== "dislike",
				})}
				onClick={handleFeedback("dislike")}
			/>
		</div>
	);
};
