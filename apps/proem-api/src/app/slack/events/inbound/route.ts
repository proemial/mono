import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import { uuid } from "@proemial/utils/uid";
import { isNakedLink, isNakedMention } from "../../utils/routing";

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
		"[/slack/events/inbound]",
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
		console.log("exit[subtype]", payload.event.subtype);
		return NextResponse.json({ status: "ok" });
	}
	// Do not respond to messages unless they are a naked link
	if (payload.event?.type === "message" && !isNakedLink(payload)) {
		console.log("exit[nakedlink]", payload.event.text);
		return NextResponse.json({ status: "ok" });
	}
	// Do not respond to naked mentions
	if (isNakedMention(payload)) {
		console.log("exit[nakedmention]", payload.event.text);
		return NextResponse.json({ status: "ok" });
	}
	console.log(JSON.stringify(payload));

	const app = await SlackDb.entities.get(payload.api_app_id);
	const callbackUrl = app?.metadata?.callback ?? "https://api.proem.ai";

	const teamId = payload.team_id ?? payload.team?.id ?? payload.message?.team;
	const channelId = payload.event?.channel ?? payload.channel?.id;
	const channel = await getChannelInfo(teamId, channelId);

	const metadata = {
		callback: `${callbackUrl}/slack/events/outbound`,
		appId: payload.api_app_id,
		eventId: payload.event_id ?? uuid(),
		teamId,
		...channel,
	};
	console.log(metadata);

	await SlackDb.events.insert({
		createdAt: new Date(),
		metadata,
		source: "slack",
		type: "SlackEventCallback",
		payload,
	});

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

async function getChannelInfo(teamId: string, channelId: string) {
	if (!teamId || !channelId) {
		return {};
	}
	const team = await SlackDb.entities.get(teamId);

	const channel = await fetch(
		`https://slack.com/api/conversations.info?channel=${channelId}`,
		{
			headers: {
				Authorization: `Bearer ${team?.metadata?.accessToken}`,
			},
		},
	);
	const channelInfo = await channel.json();

	return {
		channel: {
			id: channelId,
			name: channelInfo.channel.name,
			description: channelInfo.channel.purpose?.value,
			topic: channelInfo.channel.topic?.value,
		},
	};
}
