import { z } from "zod";

type FeedbackKey = "score"; // This is the display key in LangSmith
type FeedbackSourceType = "user"; // We can filter on feedback source in LangSmith

export const parseScore = (score: string | number | undefined): number =>
	z.coerce.number().min(0).max(1).parse(score);

export const parseRunId = (runIdParam: string | undefined): string =>
	z.string().uuid().parse(runIdParam);

export const uploadFeedback = async (score: number, runId: string) => {
	const response = await fetch("https://api.smith.langchain.com/feedback", {
		method: "POST",
		body: JSON.stringify({
			run_id: runId,
			key: "score" satisfies FeedbackKey,
			score,
			feedback_source: {
				type: "user" satisfies FeedbackSourceType,
			},
		}),
		headers: {
			"Content-Type": "application/json",
			"x-api-key": process.env.LANGCHAIN_API_KEY,
		},
	});
	if (!response.ok) {
		console.error(
			"Failed to upload feedback to LangSmith: ",
			response.status,
			response.statusText,
		);
		return { error: { status: response.status, message: response.statusText } };
	}
	return response.json();
};
