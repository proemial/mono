import { Time } from "@proemial/utils/time";
import { inngest } from "./client";
import { getItems } from "@/app/(pages)/news/cached-items";
import { revalidateTag } from "next/dist/server/web/spec-extension/revalidate";

const eventName = "news/flush";
const eventId = "news/flush/fn";

export const NewsFlushTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();

			revalidateTag("news-feed");
			const items = await getItems(true);

			return {
				event,
				body: {
					count: items.length,
					elapsed: Time.elapsed(begin),
				},
			};
		},
	),
};
