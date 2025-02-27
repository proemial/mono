import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { SlackAnnotateEvent, SlackAskEvent } from ".";

export const Metrics = {
	annotate: {
		log: async (
			step: string,
			payload: SlackAnnotateEvent,
			duration: number,
			error?: string,
		) => {
			return await logEvent("annotate", step, payload, duration, error);
		},
	},
	answer: {
		log: async (
			step: string,
			payload: SlackAskEvent,
			duration: number,
			error?: string,
		) => {
			return await logEvent("answer", step, payload, duration, error);
		},
	},
};

const logEvent = async (
	operation: "annotate" | "answer",
	step: string,
	payload: SlackAnnotateEvent | SlackAskEvent,
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
				duration,
			},
		],
	});

	await SlackDb.metrics.insert({
		ts: new Date(),
		metadata: {
			step,
			operation,
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
