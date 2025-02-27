import { EventLogItem } from "../../mongodb/slack/v2.models";
import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { EventCallbackPayload } from "../models/event-models";
import { SlackEventMetadata } from "../models/metadata-models";

export const ignored = "ignored";

export async function parseRequest(
	text: string,
	classifier: (
		payload: EventCallbackPayload,
		event: EventLogItem | null,
	) => string,
) {
	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text?.startsWith("ssl_check=")
			? decodeURIComponent(text.slice(10))
			: text;

	const payload = JSON.parse(unencoded) as EventCallbackPayload;
	console.log("PAYLOAD", JSON.stringify(payload));

	const app = await SlackDb.apps.get(payload.api_app_id);
	const callbackUrl = app?.metadata?.callback ?? "https://assistant.proem.ai";

	const fields = parseFields(payload);

	const partial = {
		...fields,
		appId: payload.api_app_id,
		callback: `${callbackUrl}/api/events/outbound`,
	};

	// TODO: return target:ignore if requests has workers
	const event = await SlackDb.eventLog.get(partial);

	const metadata = {
		...partial,
		target: classifier(payload, event),
	} as SlackEventMetadata;
	console.log("METADATA", JSON.stringify(metadata));

	return { payload, metadata };
}

function parseFields(payload: EventCallbackPayload) {
	const channelId = getChannelId(payload);

	return {
		channelId,
		teamId: getTeamId(payload),
		user: getUserId(payload),
		ts: getTs(payload),
		threadTs: getThreadTs(payload),
		isAssistant: channelId?.startsWith("D"),
	};
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function getChannelId(payload: any) {
	return (
		payload.event?.message?.channel ??
		payload.event?.channel ??
		payload.channel?.id ??
		payload.event?.assistant_thread?.channel_id ??
		payload.event?.assistant_thread?.context?.channel_id
	);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function getTeamId(payload: any) {
	return (
		payload.team_id ??
		payload.team?.id ??
		payload.event?.team ??
		payload.message?.team
	);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function getUserId(payload: any) {
	return (
		payload.event?.message?.user ??
		payload.event?.user ??
		payload.user?.id ??
		payload.event?.assistant_thread?.user_id ??
		payload.event?.assistant_thread?.context?.user_id
	);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function getTs(payload: any) {
	return (
		payload.event?.message?.ts ??
		payload.event?.ts ??
		payload.container?.message_ts
	);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function getThreadTs(payload: any) {
	return (
		payload.event?.message?.thread_ts ??
		payload.event?.thread_ts ??
		payload.event?.assistant_thread?.thread_ts ??
		payload.event?.assistant_thread?.context?.thread_ts
	);
}
