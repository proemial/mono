import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { AnnotateRouter } from "@/inngest/routing";
import { SlackAnnotateEvent } from "../../workers";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { Metrics } from "../metrics";
import { Slack } from "../helpers/slack";

export const eventName = "annotate/slack";
const eventId = "annotate/slack/fn";

export const slackAnnotateResponseTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, retries: 0 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data } as SlackAnnotateEvent;

			try {
				const result = await taskWorker(payload);
				await Metrics.annotate.log(eventName, payload, Time.elapsed(begin));
				// TODO: log totals

				return result;
			} catch (error) {
				await Metrics.annotate.log(
					eventName,
					payload,
					Time.elapsed(begin),
					(error as Error).message,
				);
				throw error;
			} finally {
				Time.log(begin, eventName);
			}
		},
	),
};

const taskWorker = async (payload: SlackAnnotateEvent) => {
	const begin = Time.now();

	if (!payload.metadata) {
		throw new Error("No metadata provided");
	}

	const scraped = await SlackDb.scraped.get(payload.url);
	if (!scraped?.summaries?.query) {
		throw new Error("No query found");
	}

	await Slack.postSummary(
		payload.metadata,
		scraped.summaries.query,
		scraped.url,
		scraped.content.title,
	);

	// Next step from router
	const next = AnnotateRouter.next(eventName, payload.url, payload.metadata);
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
