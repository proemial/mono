import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();
	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text?.startsWith("ssl_check=")
			? decodeURIComponent(text.slice(10))
			: text;

	const body = JSON.parse(unencoded);
	console.log(JSON.stringify(body));

	// Handle Slack URL verification
	if (body.type === "url_verification") {
		return NextResponse.json({ challenge: body.challenge });
	}

	const updated = await SlackDb.events.insert({
		createdAt: new Date(),
		metadata: {
			appId: body.api_app_id,
			eventId: body.event_id,
		},
		source: "slack",
		type: "SlackEventCallback",
		payload: body,
	});
	console.log(updated);

	const target = await getTarget(body);

	const result = await fetch(target.url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...target.headers,
		},
		body: JSON.stringify({
			...target.body,
			blocks: [
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
			],
		}),
	});

	return NextResponse.json({ body, result });
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function getTarget(body: any): Promise<Target> {
	if (body.response_url) {
		return {
			url: body.response_url,
			headers: {},
			body: {},
		};
	}

	const teamId = (body.event.team ?? body.message.team) as string;
	if (!teamId) {
		throw new Error("TeamId not found");
	}

	const team = await SlackDb.entities.get(teamId);
	if (!team) {
		throw new Error("Team not found");
	}
	if (!team.metadata?.accessToken) {
		throw new Error("Token not found");
	}

	return {
		url: "https://slack.com/api/chat.postMessage",
		headers: {
			Authorization: `Bearer ${team.metadata?.accessToken}`,
		},
		body: {
			channel: body.event.channel,
		},
	};
}

type Target = {
	url: string;
	headers: Partial<Record<string, string>>;
	body: Partial<Record<string, string>>;
};
