import { EventCallbackPayload } from "../slack/event.model";
import { SlackEventMetadata } from "../slack/metadata.models";

export async function sendToN8n(
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) {
	return await fetch(process.env.N8N_WEBHOOK_URL as string, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			metadata,
			payload,
		}),
	});
}
