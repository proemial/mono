import { eventName as scrapeEventName } from "./workers/annotate/scrape.task";
import { eventName as queryEventName } from "./workers/annotate/query.task";
import { eventName as fetchEventName } from "./workers/annotate/fetch.task";
import { eventName as summarizeEventName } from "./workers/annotate/summarize.task";
import { eventName as slackAnnotateEventName } from "./workers/routing/slack-annotate.task";
import { eventName as slackAskEventName } from "./workers/routing/slack-ask.task";
import { eventName as askEventName } from "./workers/ask/summarize.task";
import { SlackEventMetadata } from "@proemial/adapters/slack/metadata.models";

import { inngest } from "./client";

export const AnnotateRouter = {
	// scrapeEvent -> queryEvent -> slackEvent -> fetchEvent -> summarizeEvent
	next: async (step: string, url: string, metadata?: SlackEventMetadata) => {
		switch (step) {
			case scrapeEventName: {
				return await enqueue(queryEventName, { url }, metadata);
			}

			case queryEventName: {
				return await enqueue(slackAnnotateEventName, { url }, metadata);
			}

			case slackAnnotateEventName: {
				return await enqueue(fetchEventName, { url }, metadata);
			}

			case fetchEventName: {
				return await enqueue(summarizeEventName, { url }, metadata);
			}

			default:
				return undefined;
		}
	},
};

export const AskRouter = {
	// scrapeEvent -> queryEvent -> slackEvent -> fetchEvent -> summarizeEvent
	next: async (
		step: string,
		thread: string,
		answer: string,
		metadata?: SlackEventMetadata,
	) => {
		switch (step) {
			case askEventName: {
				return await enqueue(slackAskEventName, { thread, answer }, metadata);
			}

			default:
				return undefined;
		}
	},
};

const enqueue = async (
	name: string,
	payload: Record<string, string>,
	metadata?: SlackEventMetadata,
) => {
	const result = await inngest.send({
		name,
		data: {
			...payload,
			metadata,
		},
	});
	console.log("router enqueue result", name, result);

	return name;
};
