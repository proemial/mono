import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { SlackAnnotateEvent } from "../../workers";

export const logMetrics = async (
	step: string,
	payload: SlackAnnotateEvent,
	duration: number,
	error?: string,
) => {
	await SlackDb.metrics.insert({
		ts: new Date(),
		metadata: {
			step,
			operation: "annotate",
			appId: payload.metadata.appId,
			teamId: payload.metadata.teamId,
		},
		metrics: {
			error,
			duration,
		},
	});
};
