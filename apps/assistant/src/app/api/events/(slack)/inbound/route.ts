import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import * as slack from "@proemial/adapters/slack/helpers/payload";
import { sendToN8n } from "@proemial/adapters/n8n/n8n";
import { dispatchSlackEvent } from "./dispatch";
import { EventCallbackPayload } from "@proemial/adapters/slack/models/event-models";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { Time } from "@proemial/utils/time";
import {
	classifyRequest,
	ignored,
} from "../../../../../classification/request-classifier";
import { Slack } from "@/inngest/workers/helpers/slack";

export const revalidate = 0;

export async function POST(request: Request) {
	const begin = Time.now();

	const text = await request.text();
	const { payload, metadata } = await slack.parseRequest(text, classifyRequest);

	try {
		if (metadata.target === ignored.type) {
			if (payload.type === "url_verification") {
				return NextResponse.json({ challenge: payload.challenge });
			}
			return success;
		}

		const dispatched = await dispatchSlackEvent(payload, metadata);
		await upsertToEventLog(payload, metadata, begin);

		console.log("dispatched", dispatched);
		if (dispatched) {
			return success;
		}

		const result = await sendToN8n(payload, metadata);
		console.log("n8n", result);
		return success;
	} catch (error) {
		await upsertToEventLog(payload, metadata, begin, (error as Error).message);
		Slack.updateStatus(metadata, (error as Error).message, true, true);

		// Error is handled, no reason to send an error to slack
		return success;
	}
}

const success = NextResponse.json({ status: "ok" });

async function upsertToEventLog(
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
	begin: number,
	error?: string,
) {
	if (payload.type === "url_verification" || payload.type === "ssl_check") {
		return;
	}
	return await SlackDb.eventLog.upsert({
		...(metadata.target !== ignored.type && {
			target: metadata.target,
		}),
		...(metadata.target !== ignored.type &&
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
				createdAt: new Date(begin),
				type:
					metadata.target === ignored.type
						? ignored.type
						: payload.type === "event_callback"
							? metadata.target
							: payload.type,
				input: { payload },
				duration: Time.elapsed(begin),
				...(error && {
					error,
				}),
			},
		],
	});
}
