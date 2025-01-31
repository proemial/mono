import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import { getTarget, isNakedLink } from "../../utils/routing";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();

	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text?.startsWith("ssl_check=")
			? decodeURIComponent(text.slice(10))
			: text;

	const payload = JSON.parse(unencoded);

	console.log(
		"[/slack/notbot/events]",
		payload.api_app_id,
		payload.event_id,
		payload.type,
		payload.event?.type,
		payload.event?.subtype,
		payload.event?.bot_profile?.name,
	);

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
	if (payload.event?.subtype) {
		console.log("exit[edit]", payload.event.subtype);
		return NextResponse.json({ status: "ok" });
	}
	// Do not respond to messages unless they are a naked link
	if (payload.event?.type === "message" && !isNakedLink(payload)) {
		console.log("exit[msg]", payload.event.text);
		return NextResponse.json({ status: "ok" });
	}

	console.log(JSON.stringify(payload));

	const metadata = {
		appId: payload.api_app_id,
		eventId: payload.event_id,
		teamId: payload.team_id,
	};

	const updated = await SlackDb.events.insert({
		createdAt: new Date(),
		metadata,
		source: "slack",
		type: "SlackEventCallback",
		payload,
	});
	console.log(updated);

	const blocks = [
		{
			type: "header",
			text: {
				type: "plain_text",
				text: `type: ${payload.type}, eventType: ${payload.event.type}`,
				emoji: true,
			},
		},
	];

	const target = await getTarget({ metadata, payload });
	console.log(target);

	const result = await fetch(target.url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...target.headers,
		},
		body: JSON.stringify({
			...target.body,
			blocks,
		}),
	});

	return NextResponse.json({ body: payload, result });
}
