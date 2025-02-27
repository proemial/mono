import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { AskRouter } from "@/inngest/routing";
import { SlackAskEvent } from "../../workers";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { SlackEventCallback } from "@proemial/adapters/mongodb/slack/events.types";
import { SlackMessenger } from "@proemial/adapters/slack/slack-messenger";
import { Metrics } from "../metrics";

export const eventName = "ask/slack";
const eventId = "ask/slack/fn";

export const slackAskResponseTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, retries: 0 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data } as SlackAskEvent;

			try {
				const result = await taskWorker(payload);
				await Metrics.answer.log(eventName, payload, Time.elapsed(begin));
				// TODO: log totals

				return result;
			} catch (error) {
				await Metrics.answer.log(
					eventName,
					payload,
					Time.elapsed(begin),
					(error as Error).message,
				);
				throw error;
			}
		},
	),
};

const taskWorker = async (payload: SlackAskEvent) => {
	const begin = Time.now();

	if (!payload.metadata) {
		throw new Error("No metadata provided");
	}

	await SlackMessenger.sendMessage(payload.metadata, payload.answer);

	// Next step from router
	const next = AskRouter.next(
		eventName,
		payload.thread,
		payload.answer,
		payload.metadata,
	);
	return {
		event: eventName,
		body: {
			payload,
			steps: {
				current: eventName,
				next,
			},
			elapsed: Time.elapsed(begin),
		},
	};
};
