import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import { uuid } from "@proemial/utils/uid";
import { getChannelInfo } from "@proemial/adapters/slack/channel";
import { showSuggestions } from "@proemial/adapters/slack/assistant";
import { getThreeRandomStarters } from "@/app/api/events/(slack)/inbound/suggestions";
import { parseMessageSource } from "@proemial/adapters/slack/message";
import { eventName as scrapeEventName } from "@/inngest/workers/annotate/scrape.task";
import { inngest } from "@/inngest/client";
import { nakedLink, nakedMention } from "@proemial/adapters/slack/routing";

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

	const { teamId, channelId } = parseMessageSource(payload);
	const channelInfo = await getChannelInfo(teamId, channelId);
	console.log("channelInfo", channelInfo, teamId, channelId);

	if (nakedLink(payload)) {
		payload.event.subtype = "link";
	}

	// Do not respond to bot messages
	if (payload.event?.bot_profile) {
		console.log("exit[botmsg]", payload.event.bot_profile);
		return NextResponse.json({ status: "ok" });
	}
	// Do not respond to message edits
	if (payload.event?.subtype && payload.event?.subtype !== "link") {
		console.log("exit[subtype]", payload.event.subtype);
		return NextResponse.json({ status: "ok" });
	}
	// Do not respond to messages unless they are a naked link
	if (
		payload.event?.type === "message" &&
		!nakedLink(payload) &&
		!channelInfo.channel?.id.startsWith("D")
	) {
		console.log("exit[message]", payload.event.text);
		return NextResponse.json({ status: "ok" });
	}
	// Do not respond to naked mentions
	if (nakedMention(payload)) {
		console.log("exit[nakedmention]", payload.event.text);
		return NextResponse.json({ status: "ok" });
	}
	if (payload.event?.type === "assistant_thread_started") {
		const event = payload.event as AssistantThreadStartedEvent;

		const status = await showSuggestions(
			event.assistant_thread.channel_id,
			event.assistant_thread.thread_ts,
			channelInfo.token as string,
			getThreeRandomStarters(),
			"Trustworthy answers to any question, such as:",
		);
		return NextResponse.json({ status });
	}
	if (payload.event?.type === "assistant_thread_context_changed") {
		console.log("exit[assistant_thread_context_changed]", payload.event.text);
		return NextResponse.json({ status: "ok" });
	}
	// if (channelInfo.channel?.id.startsWith("D")) {
	// 	const result = await fetch(
	// 		"https://slack.com/api/assistant.threads.setStatus",
	// 		{
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: `Bearer ${channelInfo.token}`,
	// 			},
	// 			body: JSON.stringify({
	// 				channel_id: payload.event.channel,
	// 				thread_ts: payload.event.ts,
	// 				status: "Doing it",
	// 			}),
	// 		},
	// 	);
	// 	console.log("assistant_app_thread", result.status, await result.json());
	// }

	const app = await SlackDb.apps.get(payload.api_app_id);
	const callbackUrl = app?.metadata?.callback ?? "https://assistant.proem.ai";

	const metadata = {
		callback: `${callbackUrl}/slack/events/outbound`,
		appId: payload.api_app_id,
		eventId: payload.event_id ?? uuid(),
		teamId,
		channel: channelInfo.channel,
		team: channelInfo.team,
	};
	console.log({
		metadata,
		payload,
	});

	await SlackDb.events.insert({
		createdAt: new Date(),
		metadata,
		source: "slack",
		type: "SlackEventCallback",
		payload,
	});

	// TODO: Handle with inngest
	// const result = await fetch(process.env.N8N_WEBHOOK_URL as string, {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify({
	// 		metadata,
	// 		payload,
	// 	}),
	// });

	if (nakedLink(payload)) {
		const result = await inngest.send({
			name: scrapeEventName,
			data: {
				url: nakedLink(payload),
				metadata,
			},
		});
		console.log("scrape enqueue result", scrapeEventName, result);

		return NextResponse.json({ body: payload, result });
	}

	return NextResponse.json({ status: "ok" });
}

type AssistantThreadStartedEvent = {
	type: "assistant_thread_started";
	assistant_thread: {
		user_id: string;
		context: {
			channel_id: string;
			team_id: string;
			enterprise_id: string;
		};
		channel_id: string;
		thread_ts: string;
	};
	event_ts: string;
};
