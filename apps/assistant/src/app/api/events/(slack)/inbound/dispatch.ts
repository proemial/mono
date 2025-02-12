import { EventCallbackPayload } from "@proemial/adapters/slack/event.model";
import { SlackEventMetadata } from "@proemial/adapters/slack/metadata.models";
import { nakedLink } from "@proemial/adapters/slack/routing";
import { eventName as scrapeEventName } from "@/inngest/workers/annotate/scrape.task";
import { inngest } from "@/inngest/client";

export async function dispatchSlackEvent(
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) {
	if (nakedLink(payload)) {
		const firstBlock = payload.event.blocks?.[0];
		const url =
			firstBlock && "elements" in firstBlock
				? findLinkUrl(firstBlock.elements)
				: undefined;
		console.log("nakedLink", url);

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

	return undefined;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function findLinkUrl(elements: any[]): string | undefined {
	for (const element of elements) {
		// Check if current element is a link
		if (element.type === "link") {
			return element.url;
		}

		// Recursively check nested elements
		if (element.elements && Array.isArray(element.elements)) {
			const nestedUrl = findLinkUrl(element.elements);
			if (nestedUrl) return nestedUrl;
		}
	}
	return undefined;
}
