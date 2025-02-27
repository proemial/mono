import { eventName as scrapeEventName } from "./workers/annotate/1-scrape.task";
import { eventName as queryEventName } from "./workers/annotate/2-summarize.task";
import { eventName as slackAskEventName } from "./workers/ask/2-slack.task";
import { eventName as slackAnnotateEventName } from "./workers/annotate/3-slack.task";
import { eventName as askEventName } from "./workers/ask/1-summarize.task";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";

import { inngest } from "./client";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";

export const AnnotateRouter = {
	// scrapeEvent -> queryEvent -> slackEvent -> fetchEvent -> summarizeEvent
	next: async (step: string, url: string, metadata: SlackEventMetadata) => {
		switch (step) {
			case scrapeEventName: {
				return await enqueue(queryEventName, { url }, metadata);
			}

			case queryEventName: {
				return await enqueue(slackAnnotateEventName, { url }, metadata);
			}

			// case slackAnnotateEventName: {
			// 	return await enqueue(fetchEventName, { url }, metadata);
			// }

			// case fetchEventName: {
			// 	return await enqueue(summarizeEventName, { url }, metadata);
			// }

			default:
				await logCompleted(metadata);
				return undefined;
		}
	},
};

export const AskRouter = {
	// summarizeEvent -> slackEvent
	next: async (
		step: string,
		thread: string,
		answer: string,
		metadata: SlackEventMetadata,
	) => {
		switch (step) {
			case askEventName: {
				return await enqueue(slackAskEventName, { thread, answer }, metadata);
			}

			default:
				await logCompleted(metadata);
				return undefined;
		}
	},
};

const enqueue = async (
	name: string,
	payload: Record<string, string>,
	metadata: SlackEventMetadata,
) => {
	const result = await inngest.send({
		name,
		data: {
			...payload,
			metadata,
		},
	});
	console.log("router enqueue result", name, result);

	return name;
};

export const logCompleted = async (metadata: SlackEventMetadata) => {
	const { duration, elapsed, initialLatency } =
		await calculateMetrics(metadata);

	await SlackDb.eventLog.upsert({
		status: "completed",
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
		requests: [],
		...(duration && {
			duration,
		}),
		...(elapsed && {
			elapsed,
		}),
		...(initialLatency && {
			initialLatency,
		}),
	});
};

async function calculateMetrics(metadata: SlackEventMetadata) {
	const event = await SlackDb.eventLog.get(metadata);

	const slackTs = event?.metadata?.context?.ts; //1740636943.540109
	const begin = slackTs
		? Math.floor(Number.parseFloat(slackTs) * 1000)
		: undefined;

	const duration = event?.requests.reduce(
		(acc, r) => acc + (r.duration ?? 0),
		0,
	);

	const elapsed = begin ? Date.now() - begin : undefined;

	const firstSeen = event?.requests.at(0)?.createdAt?.getTime();
	const initialLatency = firstSeen && begin ? firstSeen - begin : undefined;

	return {
		duration,
		elapsed,
		initialLatency,
	};
}
