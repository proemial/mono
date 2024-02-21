import { ScoreType } from "langsmith/schemas";

export type WithResults = {
	results: {
		[key: string]: {
			feedback: WithFeedback[];
		};
	};
};

type WithFeedback = {
	key: string;
	score: ScoreType;
};

export function summariseRunResults(runResults: WithResults) {
	const scores = Object.values(runResults.results).flatMap((result) =>
		result.feedback.map((feedback) => feedback.score as number),
	);
	const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

	return {
		scores,
		avg,
	};
}
