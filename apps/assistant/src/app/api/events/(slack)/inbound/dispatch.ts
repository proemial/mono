import { EventCallbackPayload } from "@proemial/adapters/slack/models/event-models";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { eventName as scrapeEventName } from "@/inngest/workers/annotate/1-scrape.task";
import { eventName as askEventName } from "@/inngest/workers/ask/1-summarize.task";
import { inngest } from "@/inngest/client";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { extractLinks } from "@proemial/adapters/slack/helpers/links";
import { isSlackFileUrl } from "@proemial/adapters/slack/files";
import { isTwitterUrl } from "@proemial/adapters/twitter";

export async function dispatchSlackEvent(
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) {
	console.log("dispatchSlackEvent", payload.type, payload.event?.type);

	const assistantThread = await SlackDb.events.getAssistantThread(
		metadata.channel.id,
	);

	const fileUrl =
		payload.event.subtype === "file_share" && payload.event.files?.[0]
			? payload.event.files[0].url_private_download
			: undefined;

	if (extractLinks(payload.event?.text).length > 0 || fileUrl) {
		// TODO: handle all links, not just the first one
		const url = fileUrl ?? extractLinks(payload.event?.text).at(0);
		if (!url) {
			return `dispatch[${scrapeEventName}]: no url found`;
		}

		// Check for inaccessible URLs, unless it's a Slack file or Twitter URL
		if (!isSlackFileUrl(url) && !isTwitterUrl(url)) {
			const probeResponse = await fetch(url);
			if (!probeResponse.ok) {
				return `dispatch[${scrapeEventName}]: url ${url} is not accessible`;
			}
		}

		const result = await inngest.send({
			name: scrapeEventName,
			data: {
				url,
				fileMimetype: fileUrl ? payload.event?.files?.[0]?.mimetype : undefined,
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
		const result = await inngest.send({
			name: askEventName,
			data: {
				thread: payload.event?.thread_ts,
				question: payload.event?.text,
				metadata: { ...metadata, assistantThread },
			},
		});
		console.log("ask enqueue result", askEventName, result);

		return `dispatch[${askEventName}]: ${result}`;
	}

	return undefined;
}
