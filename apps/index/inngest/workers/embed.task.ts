import { generateEmbedding } from "@/inngest/helpers/embeddings";
import { inngest } from "../client";
import { Time } from "@proemial/utils/time";
import { v4 as uuid } from "uuid";

const eventName = "embed";
const eventId = "embed/fn";

export const embedStream = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();

			console.log("event", event);

			if (!event.data?.text) {
				throw new Error("No text provided");
			}

			const embedding = await generateEmbedding(event.data?.text);
			console.log("embedding", embedding, uuid(event.data?.text));

			return {
				event,
				body: {
					embedding,
					elapsed: Time.elapsed(begin),
				},
			};
		},
	),
};
