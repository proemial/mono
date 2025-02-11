import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { AnnotateRouter } from "@/inngest/routers";

export const eventName = "annotate/summarize";
const eventId = "annotate/summarize/fn";

export const summarizeTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data };

			if (!payload.url) {
				throw new Error("No url provided");
			}

			// Next step from router
			const next = AnnotateRouter.next(eventName, payload.url);
			return {
				event,
				body: {
					url: payload.url,
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
