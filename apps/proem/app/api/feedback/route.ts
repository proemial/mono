import { Env } from "@proemial/utils/env";
import { NextRequest } from "next/server";
import { z } from "zod";

// Example: /api/feedback?score=1.0&runId=3db9d3b8-3c16-46ed-85c2-3ed29b290751
export async function POST(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const scoreParam = searchParams.get("score");
	const runIdParam = searchParams.get("runId");

	try {
		const score = parseScore(scoreParam);
		const runId = parseRunId(runIdParam);
		await uploadFeedback(score, runId);
		return Response.json({ score, runId });
	} catch (error) {
		return Response.json({ error: error }, { status: 400 });
	}
}

const parseScore = (scoreParam: string | null): number =>
	z.coerce.number().min(0).max(1).parse(scoreParam);

const parseRunId = (runIdParam: string | null): string =>
	z.string().uuid().parse(runIdParam);

type FeedbackKey = "score"; // This is the display key in LangSmith
type FeedbackSourceType = "user"; // We can filter on feedback source in LangSmith

const uploadFeedback = async (score: number, runId: string) => {
	const langchainApiKey = Env.get("LANGCHAIN_API_KEY");
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
			"x-api-key": langchainApiKey,
		},
	});
	if (!response.ok) {
		console.error(
			"Failed to upload feedback to LangSmith",
			response.status,
			response.statusText,
		);
	}
	return await response.json();
};
