// import { Time } from "@proemial/utils/time";
// import dayjs from "dayjs";
// import { EventPayload } from "inngest/types";
// import { inngest } from "../../client";
// import { tweetsByUser } from "../../helpers/twitter";
// import { writeFile } from "../../helpers/write-file";

// const eventName = "ingest/x/yesterday";
// const eventId = "ingest/x/yesterday/fn";

// export const xByUser = {
// 	name: eventName,
// 	worker: inngest.createFunction(
// 		{ id: eventId, concurrency: 1 },
// 		{ event: eventName },
// 		async ({ event }) => {
// 			const payload = { ...event.data };

// 			if (!payload.date) {
// 				payload.date = dayjs().subtract(5, "day").format("YYYY-MM-DD");
// 			}
// 			if (!payload.count) {
// 				payload.count = 0;
// 			}

// 			return await fetchDateWorker(payload, event);
// 		},
// 	),
// };

// type Payload = {
// 	date: string;
// 	username: string;
// };

// async function fetchDateWorker(payload: Payload, event?: EventPayload) {
// 	const begin = Time.now();
// 	try {
// 		const data = await tweetsByUser(payload.username, payload.date);
// 		console.log(data);

// 		const outputFile = await writeFile(
// 			payload.username,
// 			payload.date,
// 			data.tweets,
// 		);

// 		console.log(`Tweets written to ${outputFile}`);

// 		return {
// 			event,
// 			body: {
// 				data,
// 				elapsed: Time.elapsed(begin),
// 			},
// 		};
// 	} finally {
// 		Time.log(begin, eventId);
// 	}
// }
