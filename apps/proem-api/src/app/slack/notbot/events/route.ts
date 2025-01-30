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
	console.log(JSON.stringify(payload));

	if (payload.type === "url_verification") {
		return NextResponse.json({ challenge: payload.challenge });
	}
	if (payload.type === "ssl_check") {
		return NextResponse.json({ status: "ok" });
	}

	const metadata = {
		appId: payload.api_app_id,
		eventId: payload.event_id,
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
				text: "This was not what you expected",
				emoji: true,
			},
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "... neither was this",
			},
		},
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "↕️ Do stuff",
						emoji: true,
					},
					value: "do_stuff",
				},
			],
		},
	];

	const target = await getTarget(payload);
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
