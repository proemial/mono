import { EventCallbackPayload } from "@proemial/adapters/slack/models/event-models";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { nakedLink } from "@proemial/adapters/slack/helpers/routing";
import { eventName as scrapeEventName } from "@/inngest/workers/annotate/1-scrape.task";
import { eventName as askEventName } from "@/inngest/workers/ask/1-summarize.task";
import { inngest } from "@/inngest/client";
import { getNakedLink } from "@proemial/adapters/slack/helpers/payload";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";

export async function dispatchSlackEvent(
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) {
	console.log("dispatchSlackEvent", payload.type, payload.event?.type);

	const assistantThread = await SlackDb.events.getAssistantThread(
		metadata.channel.id,
	);

	if (nakedLink(payload)) {
		const url = getNakedLink(payload);
		if (!url) {
			return `dispatch[${scrapeEventName}]: no url found`;
		}

		const result = await inngest.send({
			name: scrapeEventName,
			data: {
				url,
				metadata: { ...metadata, assistantThread },
			},
		});
		console.log("scrape enqueue result", scrapeEventName, result);

		return `dispatch[${scrapeEventName}]: ${result}`;
	}

	if (
		payload.event?.type === "message" ||
		payload.event?.type === "app_mention"
	) {
		// if (!payload.event?.thread_ts) {
		// 	return `dispatch[${askEventName}]: no thread_ts found`;
		// }

		const result = await inngest.send({
			name: askEventName,
			data: {
				thread: payload.event?.thread_ts,
				question: payload.event?.text,
				metadata: { ...metadata, assistantThread },
			},
		});
		console.log("scrape enqueue result", askEventName, result);

		return `dispatch[${askEventName}]: ${result}`;
	}

	return undefined;
}
