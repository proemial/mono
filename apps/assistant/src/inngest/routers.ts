import { eventName as scrapeEventName } from "./workers/annotate/scrape.task";
import { eventName as queryEventName } from "./workers/annotate/query.task";
import { eventName as fetchEventName } from "./workers/annotate/fetch.task";
import { eventName as summarizeEventName } from "./workers/annotate/summarize.task";
import { eventName as slackEventName } from "./workers/routing/slack.task";
import { SlackEventMetadata } from "@proemial/adapters/slack/metadata.models";

import { inngest } from "./client";

export const AnnotateRouter = {
	next: async (step: string, url: string, metadata?: SlackEventMetadata) => {
		switch (step) {
			case scrapeEventName: {
				return await enqueue(queryEventName, url, metadata);
			}

			case queryEventName: {
				return await enqueue(fetchEventName, url, metadata);
			}

			case fetchEventName: {
				return await enqueue(summarizeEventName, url, metadata);
			}

			case summarizeEventName: {
				return await enqueue(slackEventName, url, metadata);
			}

			default:
				return undefined;
		}
	},
};

// nst result = await inngest.send({
// 	name: scrapeEventName,
// 	data: {
// 		url: nakedLink(payload),
// 		metadata,
// 	},
// });

const enqueue = async (
	name: string,
	url: string,
	metadata?: SlackEventMetadata,
) => {
	const result = await inngest.send({
		name,
		data: {
			url,
			metadata,
		},
	});
	console.log("router enqueue result", name, result);

	return name;
};
