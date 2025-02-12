import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import { showSuggestions } from "@proemial/adapters/slack/assistant";
import { getThreeRandomStarters } from "@/app/api/events/(slack)/inbound/suggestions";
import * as slack from "@proemial/adapters/slack/payload";
import { sendToN8n } from "@proemial/adapters/n8n/n8n";
import { dispatchSlackEvent } from "./dispatch";

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
				payload,
				getThreeRandomStarters(),
				"Trustworthy answers to any question, such as:",
			);
		}

		return success;
	}

	// TODO: set status on assistant messages
	// if (channelInfo.channel?.id.startsWith("D")) {
	// 	const result = await setStatus(payload, "Doing it");
	// }

	await SlackDb.events.insert({
		createdAt: new Date(),
		metadata,
		source: "slack",
		type: "SlackEventCallback",
		payload,
	});

	const dispatched = await dispatchSlackEvent(payload, metadata);
	console.log("dispatched", dispatched);
	if (dispatched) {
		return success;
	}

	const result = await sendToN8n(payload, metadata);
	console.log("n8n", result);

	return success;
}

const success = NextResponse.json({ status: "ok" });
