import { defaultVectorSpaceName } from "@/data/db/vector-spaces";
import { inngest } from "../../client";
import { Time } from "@proemial/utils/time";
import dayjs from "dayjs";

const eventName = "ingest/oa/range";
const eventId = "ingest/oa/range/fn";

export const oaByRangeStream = {
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
			if (!event.data?.from || !event.data?.to) {
				throw new Error("No from or to date provided");
			}

			let count = 0;
			let date = dayjs(event.data.from);
			while (date.isBefore(dayjs(event.data.to).add(1, "day"))) {
				await inngest.send({
					name: "ingest/oa/date",
					data: {
						date: date.format("YYYY-MM-DD"),
						space: payload.space,
					},
				});
				date = date.add(1, "day");
				count++;
			}

			return {
				event,
				body: {
					datesScheduled: count,
					elapsed: Time.elapsed(begin),
				},
			};
		},
	),
};
