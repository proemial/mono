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

	// if (body.type === "block_actions") {
	// 	console.log("block_actions");
	// 	const result = await fetch(body.response_url, {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({
	// 			text: "From Do stuff button",
	// 			thread_ts: body.message.ts,
	// 		}),
	// 	});

	// 	return NextResponse.json({ body, result });
	// }

	try {
		const webhookUrl = await getTargetUrl(body);

		const result = await fetch(webhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
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
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ error }, { status: 500 });
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function getTargetUrl(body: any) {
	if (body.response_url) {
		return body.response_url;
	}

	const channelId = body.event.channel || (body.event.channel.id as string);
	if (!channelId) {
		throw new Error("ChannelId not found");
	}

	const channel = await SlackDb.entities.get(channelId);
	if (!channel) {
		throw new Error("Channel not found");
	}

	const webhookUrl = channel.metadata?.url;
	if (!webhookUrl) {
		throw new Error("Webhook URL not found");
	}

	return webhookUrl;
}
