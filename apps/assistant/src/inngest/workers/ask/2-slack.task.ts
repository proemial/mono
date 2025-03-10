import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { AskRouter } from "@/inngest/routing";
import { SlackAskEvent } from "../../workers";
import { Metrics } from "../metrics";
import { Slack } from "../helpers/slack";

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
				Slack.updateStatus(payload.metadata, (error as Error).message, true);
				throw error;
			} finally {
				Time.log(begin, eventName);
			}
		},
	),
};

const taskWorker = async (payload: SlackAskEvent) => {
	const begin = Time.now();

	if (!payload.metadata) {
		throw new Error("No metadata provided");
	}

	await Slack.postAnswer(payload.metadata, payload.answer);

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
