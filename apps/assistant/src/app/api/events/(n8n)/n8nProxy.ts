import { SlackAnnotateEvent, SlackAskEvent } from "@/inngest/workers";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { Message } from "ai";

const n8nWebhookUrl =
	"https://proem.app.n8n.cloud/webhook/4d121077-cc00-47cd-b1d7-8f249c2c4c6d";

export async function proxyToN8n(
	operation: string,
	metadata: SlackEventMetadata,
	payload: SlackAskEvent | SlackAnnotateEvent,
	messages: Message[],
	prompt?: string,
) {
	console.log("proxyToN8n", operation, metadata, payload, messages, prompt);

	const result = await fetch(n8nWebhookUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			operation,
			metadata,
			payload,
			messages,
			prompt,
		}),
	});
	const json = await result.json();
	console.log("setStatus", result.status, json);
}
