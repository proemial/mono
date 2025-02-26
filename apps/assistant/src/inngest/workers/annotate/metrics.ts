import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { SlackAnnotateEvent } from "../../workers";
import { EventContext } from "@proemial/adapters/mongodb/slack/v2.models";

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
			context: {
				channelId: payload.metadata.channel.id,
				userId: payload.metadata.user,
				ts: payload.metadata.ts,
				threadTs: payload.metadata.threadTs,
			},
		},
		metrics: {
			error,
			duration,
		},
	});
};
