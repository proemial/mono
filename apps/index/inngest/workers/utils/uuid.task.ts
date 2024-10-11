import { qdrantId } from "@/data/db/qdrant";
import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";

const eventName = "utils/uuid";
const eventId = "utils/uuid/fn";

export const uuidTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data };

			if (!payload.text) {
				throw new Error("No text provided");
			}

			return {
				event,
				body: {
					uuid: qdrantId(payload.text),
					space: payload.space,
					elapsed: Time.elapsed(begin),
				},
			};
		},
	),
};
