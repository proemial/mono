import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import { uuid } from "@proemial/utils/uid";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();
	console.log("[/slack/broker/in]", text);

	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text?.startsWith("ssl_check=")
			? decodeURIComponent(text.slice(10))
			: text;

	const payload = JSON.parse(unencoded);
	console.log(JSON.stringify(payload));

	// Handle Slack verification requests
	if (payload.type === "url_verification") {
		return NextResponse.json({ challenge: payload.challenge });
	}
	if (payload.type === "ssl_check") {
		return NextResponse.json({ status: "ok" });
	}
	// Do not respond to bot messages
	if (payload.event?.bot_profile) {
		console.log("exit[botmsg]", payload.event.bot_profile);
		return NextResponse.json({ status: "ok" });
	}
	// Do not respond to message edits
	if (payload.event.subtype) {
		console.log("exit[edit]", payload.event.subtype);
		return NextResponse.json({ status: "ok" });
	}

	const metadata = {
		appId: payload.api_app_id,
		eventId: payload.event_id ?? uuid(),
		teamId: payload.team_id ?? payload.team?.id ?? payload.message?.team,
	};

	const updated = await SlackDb.events.insert({
		createdAt: new Date(),
		metadata,
		source: "slack",
		type: "SlackEventCallback",
		payload,
	});
	console.log(updated);

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

	return NextResponse.json({ body: payload, result });
}
