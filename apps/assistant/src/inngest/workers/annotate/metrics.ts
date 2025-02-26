import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { SlackAnnotateEvent } from "../../workers";

export const logEvent = async (
	step: string,
	payload: SlackAnnotateEvent,
	duration: number,
	error?: string,
) => {
	const { metadata } = payload;
	await SlackDb.eventLog.upsert({
		...(error && {
			status: "failed",
		}),
		metadata: {
			appId: metadata.appId,
			teamId: metadata.teamId,
			context: {
				channelId: metadata.channelId,
				userId: metadata.user,
				ts: metadata.ts,
				threadTs: metadata.threadTs,
			},
		},
		requests: [
			{
				type: `worker:${step}`,
				input: { payload },
				...(error && {
					error,
				}),
			},
		],
	});

	await SlackDb.metrics.insert({
		ts: new Date(),
		metadata: {
			step,
			operation: "annotate",
			appId: metadata.appId,
			teamId: metadata.teamId,
			context: {
				channelId: metadata.channelId,
				userId: metadata.user,
				ts: metadata.ts,
				threadTs: metadata.threadTs,
			},
		},
		metrics: {
			error,
			duration,
		},
	});
};
