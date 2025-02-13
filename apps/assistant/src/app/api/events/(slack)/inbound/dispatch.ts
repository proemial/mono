import { EventCallbackPayload } from "@proemial/adapters/slack/event.model";
import { SlackEventMetadata } from "@proemial/adapters/slack/metadata.models";
import { nakedLink } from "@proemial/adapters/slack/routing";
import { eventName as scrapeEventName } from "@/inngest/workers/annotate/scrape.task";
import { eventName as askEventName } from "@/inngest/workers/ask/summarize.task";
import { inngest } from "@/inngest/client";
import { getNakedLink } from "@proemial/adapters/slack/payload";

export async function dispatchSlackEvent(
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) {
	console.log("dispatchSlackEvent", payload.type, payload.event?.type);
	if (nakedLink(payload)) {
		const url = getNakedLink(payload);
		if (!url) {
			return `dispatch[${scrapeEventName}]: no url found`;
		}

		const result = await inngest.send({
			name: scrapeEventName,
			data: {
				url,
				metadata,
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
				metadata,
			},
		});
		console.log("scrape enqueue result", askEventName, result);

		return `dispatch[${askEventName}]: ${result}`;
	}

	return undefined;
}
