import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import { showSuggestions } from "@proemial/adapters/slack/assistant";
import { getThreeRandomStarters } from "@/app/api/events/(slack)/inbound/suggestions";
import * as slack from "@proemial/adapters/slack/helpers/payload";
import { sendToN8n } from "@proemial/adapters/n8n/n8n";
import { dispatchSlackEvent } from "./dispatch";
import { EventCallbackPayload } from "@proemial/adapters/slack/models/event-models";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();
	const { payload, metadata } = await slack.parseRequest(text);

	await upsertToEventLog(payload, metadata);

	if (metadata.target === slack.ignored) {
		if (payload.type === "url_verification") {
			return NextResponse.json({ challenge: payload.challenge });
		}

		if (payload.event?.type === "assistant_thread_started") {
			await showSuggestions(
				metadata,
				getThreeRandomStarters(),
				"Trustworthy answers to any question, such as:",
			);
		}

		return success;
	}

	const dispatched = await dispatchSlackEvent(payload, metadata);
	console.log("dispatched", dispatched);
	if (dispatched) {
		return success;
	}

	// Fallback to N8N for unknown events
	const result = await sendToN8n(payload, metadata);
	console.log("n8n", result);

	return success;
}

const success = NextResponse.json({ status: "ok" });

async function upsertToEventLog(
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) {
	if (payload.type === "url_verification" || payload.type === "ssl_check") {
		return;
	}
	return await SlackDb.eventLog.upsert({
		...(metadata.target !== slack.ignored && {
			target: metadata.target,
		}),
		...(metadata.target !== slack.ignored &&
			metadata.target !== "dismiss" && {
				status: "started",
			}),
		metadata: {
			appId: metadata.appId,
			teamId: metadata.teamId,
			context: {
				channelId: metadata.channelId,
				userId: metadata.user,
				ts: metadata.ts,
				threadTs: metadata.threadTs,
			},
		},
		requests: [
			{
				type:
					metadata.target === slack.ignored
						? slack.ignored
						: payload.type === "event_callback"
							? metadata.target
							: payload.type,
				input: { payload },
			},
		],
	});
}
