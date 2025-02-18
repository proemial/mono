import { EventCallbackPayload } from "../slack/models/event-models";
import { SlackEventMetadata } from "../slack/models/metadata-models";

export async function sendToN8n(
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) {
	const result = await fetch(process.env.N8N_WEBHOOK_URL as string, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			metadata,
			payload,
		}),
	});
	console.log("setStatus", result.status, await result.json());

	return result.status;
}
