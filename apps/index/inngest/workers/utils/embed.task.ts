import { Time } from "@proemial/utils/time";
import {
	defaultVectorSpaceName,
	VectorSpace,
	VectorSpaceId,
	vectorSpaces,
} from "../../../data/db/vector-spaces";
import { inngest } from "../../client";
import { generateEmbedding } from "../../../data/db/embeddings";

const eventName = "utils/embed";
const eventId = "utils/embed/fn";

export const embedTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data };

			if (!payload.space) {
				payload.space = defaultVectorSpaceName;
			}
			if (!payload.text) {
				throw new Error("No text provided");
			}

			const embeddings = await generateEmbedding(
				Array.isArray(payload.text) ? payload.text : [payload.text],
				vectorSpaces[payload.space as VectorSpaceId],
			);

			return {
				event,
				body: {
					embeddings,
					space: payload.space,
					elapsed: Time.elapsed(begin),
				},
			};
		},
	),
};
