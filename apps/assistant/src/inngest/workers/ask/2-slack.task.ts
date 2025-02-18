import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { AnnotateRouter } from "@/inngest/routing";
import { SlackAnnotateEvent } from "../../workers";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { postAnswer } from "@proemial/adapters/slack/answer";
import { SlackEventCallback } from "@proemial/adapters/mongodb/slack/events.types";

export const eventName = "ask/slack";
const eventId = "ask/slack/fn";

export const slackAnnotateResponseTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data } as SlackAnnotateEvent;

			if (!payload.metadata) {
				throw new Error("No metadata provided");
			}

			const scraped = await SlackDb.scraped.get(payload.url);
			if (!scraped?.summaries?.query) {
				throw new Error("No query found");
			}

			const slackEvent = (
				await SlackDb.events.get(payload.metadata.eventId, "SlackEventCallback")
			)?.payload as SlackEventCallback;
			if (!slackEvent) {
				throw new Error("No slack event found");
			}

			const result = await postAnswer(
				payload.metadata,
				scraped.summaries.query,
				"assistant",
				"AnnotateEvent",
			);
			const { message, icons, ...rest } = await result.json();
			console.log(`${eventName} result`, result.status, rest);

			// Next step from router
			const next = AnnotateRouter.next(
				eventName,
				payload.url,
				payload.metadata,
			);
			return {
				event,
				body: {
					payload,
					steps: {
						current: eventName,
						next,
					},
					elapsed: Time.elapsed(begin),
				},
			};
		},
	),
};
