import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import { getTarget } from "../../utils/routing";

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

	if (payload.type === "url_verification") {
		console.log(`exit[${payload.type}]`, { challenge: payload.challenge });
		return NextResponse.json({ challenge: payload.challenge });
	}
	if (payload.type === "ssl_check") {
		console.log(`exit[${payload.type}]`);
		return NextResponse.json({ status: "ok" });
	}
	if (payload.event?.bot_profile) {
		console.log("exit[botmsg]", payload.event.bot_profile);
		return NextResponse.json({ status: "ok" });
	}

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
