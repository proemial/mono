import { EventCallbackPayload } from "@proemial/adapters/slack/event.model";
import { SlackEventMetadata } from "@proemial/adapters/slack/metadata.models";
import { nakedLink } from "@proemial/adapters/slack/routing";
import { eventName as scrapeEventName } from "@/inngest/workers/annotate/scrape.task";
import { inngest } from "@/inngest/client";
import { getNakedLink } from "@proemial/adapters/slack/payload";

export async function dispatchSlackEvent(
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) {
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
	if (payload.type === "message") {
		console.log("message", payload);
	}

	return undefined;
}
