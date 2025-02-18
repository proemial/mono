import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { getChannelInfo } from "./channel";
import { nakedLink, nakedMention } from "./routing";
import { uuid } from "@proemial/utils/uid";
import { EventCallbackPayload } from "../event.model";
import { SlackEventMetadata } from "../metadata.models";

export async function parseRequest(text: string) {
	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text?.startsWith("ssl_check=")
			? decodeURIComponent(text.slice(10))
			: text;

	const payload = JSON.parse(unencoded) as EventCallbackPayload;

	console.log(
		"[/slack/payload]",
		payload.api_app_id,
		payload.event_id,
		payload.type,
		payload.event?.type,
		payload.event?.subtype,
		payload.event?.bot_profile?.name,
	);

	const { teamId, channelId } = parseMessageSource(payload);
	// console.log("teamId", teamId, "channelId", channelId);

	const { channel, team, token } = await getChannelInfo(teamId, channelId);
	// console.log("channelInfo", JSON.stringify({ channel, team, token }));

	const app = await SlackDb.apps.get(payload.api_app_id);
	// console.log("app", JSON.stringify(app));

	const callbackUrl = app?.metadata?.callback ?? "https://assistant.proem.ai";

	const metadata = {
		callback: `${callbackUrl}/api/events/outbound`,
		appId: payload.api_app_id,
		eventId: payload.event_id ?? uuid(),
		teamId,
		channel,
		team,
		user: payload.event?.user,
		threadTs: payload.event?.ts,
		assistantThread: payload.event?.assistant_thread && {
			channel_id: payload.event?.assistant_thread?.channel_id,
			thread_ts: payload.event?.assistant_thread?.thread_ts,
		},
	} as SlackEventMetadata;
	console.log("metadata", JSON.stringify(metadata));

	const type = classifyRequest(payload, metadata);

	return { payload, metadata, type, token };
}

export function classifyRequest(
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) {
	// Handle Slack verification requests
	if (payload.type === "url_verification") {
		console.log("exit[url_verification]", payload.challenge);
		return "ignore";
	}
	if (payload.type === "ssl_check") {
		console.log("exit[ssl_check]");
		return "ignore";
	}
	if (payload.event?.bot_profile) {
		console.log("exit[bot_profile]", payload.event.bot_profile);
		return "ignore";
	}
	if (payload.event?.subtype && !nakedLink(payload)) {
		console.log("exit[subtype]", payload.event.subtype);
		return "ignore";
	}
	if (
		payload.event?.type === "message" &&
		!nakedLink(payload) &&
		!metadata.channel?.id.startsWith("D")
	) {
		console.log("exit[message]", payload.event.text);
		return "ignore";
	}
	if (nakedMention(payload)) {
		console.log("exit[nakedmention]", payload.event.text);
		return "ignore";
	}
	if (payload.event?.type === "assistant_thread_context_changed") {
		console.log("exit[assistant_thread_context_changed]", payload.event.text);
		return "ignore";
	}
	if (payload.event?.type === "assistant_thread_started") {
		console.log("exit[assistant_thread_started]", payload.event.text);
		return "ignore";
	}
	return undefined;
}

export function getNakedLink(payload: EventCallbackPayload) {
	if (!nakedLink(payload)) {
		return undefined;
	}

	const firstBlock = payload.event.blocks?.[0];
	const url =
		firstBlock && "elements" in firstBlock
			? findLinkUrl(firstBlock.elements)
			: undefined;

	console.log("nakedLink", url);
	return url;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function findLinkUrl(elements: any[]): string | undefined {
	for (const element of elements) {
		// Check if current element is a link
		if (element.type === "link") {
			return element.url;
		}

		// Recursively check nested elements
		if (element.elements && Array.isArray(element.elements)) {
			const nestedUrl = findLinkUrl(element.elements);
			if (nestedUrl) return nestedUrl;
		}
	}
	return undefined;
}

export function parseMessageSource(payload: Record<string, any>) {
	const teamId =
		payload.team_id ??
		payload.team?.id ??
		payload.event?.team ??
		payload.message?.team;
	const channelId =
		payload.event?.channel ??
		payload.channel?.id ??
		payload.event?.assistant_thread?.context?.channel_id;

	return {
		teamId,
		channelId,
	};
}
