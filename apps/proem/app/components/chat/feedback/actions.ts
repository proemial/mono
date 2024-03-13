"use server";

import { parseRunId, parseScore, uploadFeedback } from "./utils";

export const like = async (runId: string | undefined) =>
	doGiveFeedback(1, runId);

export const dislike = async (runId: string | undefined) =>
	doGiveFeedback(0, runId);

const doGiveFeedback = async (score: number, runId: string | undefined) => {
	const validScore = parseScore(score);
	const validRunId = parseRunId(runId);
	await uploadFeedback(validScore, validRunId);
};
