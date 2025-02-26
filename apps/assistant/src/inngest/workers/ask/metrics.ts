import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { SlackAskEvent } from "../../workers";

export const logMetrics = async (
	step: string,
	payload: SlackAskEvent,
	duration: number,
	error?: string,
) => {
	await SlackDb.metrics.insert({
		ts: new Date(),
		metadata: {
			step,
			operation: "ask",
			appId: payload.metadata.appId,
			teamId: payload.metadata.teamId,
		},
		metrics: {
			error,
			duration,
		},
	});
};
