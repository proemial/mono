import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import { showSuggestions } from "@proemial/adapters/slack/assistant";
import { getThreeRandomStarters } from "@/app/api/events/(slack)/inbound/suggestions";
import * as slack from "@proemial/adapters/slack/helpers/payload";
import { sendToN8n } from "@proemial/adapters/n8n/n8n";
import { dispatchSlackEvent } from "./dispatch";
import { EventCallbackPayload } from "@proemial/adapters/slack/event.model";
import { SlackEventMetadata } from "@proemial/adapters/slack/metadata.models";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();
	const { payload, metadata, type } = await slack.parseRequest(text);

	if (type === "ignore") {
		if (payload.type === "url_verification") {
			return NextResponse.json({ challenge: payload.challenge });
		}

		if (payload.event?.type === "assistant_thread_started") {
			await showSuggestions(
				metadata,
				getThreeRandomStarters(),
				"Trustworthy answers to any question, such as:",
			);
			await logEvent(payload, metadata);
		}

		return success;
	}

	await logEvent(payload, metadata);

	const dispatched = await dispatchSlackEvent(payload, metadata);
	console.log("dispatched", dispatched);
	if (dispatched) {
		return success;
	}

	const result = await sendToN8n(payload, metadata);
	console.log("n8n", result);

	return success;
}

const logEvent = async (
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) => {
	await SlackDb.events.insert({
		createdAt: new Date(),
		metadata,
		source: "slack",
		type: "SlackEventCallback",
		payload,
	});
};

const success = NextResponse.json({ status: "ok" });
