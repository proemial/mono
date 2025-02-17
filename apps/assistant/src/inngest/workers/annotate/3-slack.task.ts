import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { AskRouter } from "@/inngest/routing";
import { SlackAskEvent } from "../../workers";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { postAnnotation } from "@proemial/adapters/slack/message";
import { SlackEventCallback } from "@proemial/adapters/mongodb/slack/events.types";

export const eventName = "annotate/slack";
const eventId = "annotate/slack/fn";

export const slackAskResponseTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data } as SlackAskEvent;

			if (!payload.metadata) {
				throw new Error("No metadata provided");
			}

			const slackEvent = (
				await SlackDb.events.get(payload.metadata.eventId, "SlackEventCallback")
			)?.payload as SlackEventCallback;
			if (!slackEvent) {
				throw new Error("No slack event found");
			}

			const result = await postAnnotation(
				payload.metadata,
				slackEvent.event?.event_ts,
				payload.answer,
				"assistant",
				"AnnotateEvent",
			);
			const { message, icons, ...rest } = await result.json();
			console.log(`${eventName} result`, result.status, rest);

			// Next step from router
			const next = AskRouter.next(
				eventName,
				payload.thread,
				payload.answer,
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
