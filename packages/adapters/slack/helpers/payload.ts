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
	) => Promise<string>,
) {
	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text?.startsWith("ssl_check=")
			? decodeURIComponent(text.slice(10))
			: text;

	const payload = JSON.parse(unencoded) as EventCallbackPayload;
	const fields = parseFields(payload);

	const app = await SlackDb.apps.get(payload.api_app_id);
	const callbackUrl = app?.metadata?.callback ?? "https://assistant.proem.ai";

	const partial = {
		...fields,
		callback: `${callbackUrl}/api/events/outbound`,
	};

	// TODO: return target:ignore if requests has workers
	const event = await SlackDb.eventLog.get(partial);

	const metadata = {
		...partial,
		target: await classifier(payload, event),
	} as SlackEventMetadata;
	console.log({
		target: metadata.target,
		eventId: payload.event_id,
		query: `{\"metadata.appId\":\"${metadata.appId}\",\"metadata.context.channelId\":\"${metadata.channelId}\",\"metadata.context.ts\":\"${metadata.ts}\"}`,
		type: `${payload.type}/${payload.event?.type}${payload.event?.subtype ? `/${payload.event?.subtype}` : ""}`,
		text: `${payload.event?.text ?? payload.event?.message?.text}`,
	});

	return { payload, metadata };
}

export function getFollowupQuestion(payload: EventCallbackPayload) {
	return {
		// @ts-ignore
		question: payload.state.values.followups[
			"followup-question"
		].selected_option.value?.replaceAll("+", " "),
		botUser: payload.message?.user,
	};
}

function parseFields(payload: EventCallbackPayload) {
	const channelId = getChannelId(payload);

	return {
		channelId,
		teamId: getTeamId(payload),
		user: getUserId(payload),
		ts: getTs(payload),
		threadTs: getThreadTs(payload),
		appId: payload.api_app_id,
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
		payload.container?.message_ts ??
		payload.event?.assistant_thread?.thread_ts ??
		payload.event?.assistant_thread?.context?.thread_ts
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
