import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { nakedMention } from "./routing";
import { uuid } from "@proemial/utils/uid";
import { EventCallbackPayload } from "../models/event-models";
import { SlackEventMetadata } from "../models/metadata-models";
import { extractLinks } from "./links";
import { SUPPORTED_MIMETYPES } from "../files/constants";
import { FILE_SIZE_LIMIT } from "../files/constants";

export const ignored = "ignored";

export async function parseRequest(text: string) {
	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text?.startsWith("ssl_check=")
			? decodeURIComponent(text.slice(10))
			: text;

	console.log("UNENCODED", unencoded);
	const payload = JSON.parse(unencoded) as EventCallbackPayload;
	console.log("PAYLOAD", JSON.stringify(payload));

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
	const app = await SlackDb.apps.get(payload.api_app_id);
	const callbackUrl = app?.metadata?.callback ?? "https://assistant.proem.ai";

	const metadata = {
		callback: `${callbackUrl}/api/events/outbound`,
		appId: payload.api_app_id,
		eventId: payload.event_id ?? uuid(),
		teamId,
		channelId,
		// channel,
		// team,
		user:
			payload.event?.message?.user ?? payload.event?.user ?? payload.user?.id,
		ts:
			payload.event?.message?.ts ??
			payload.event?.ts ??
			payload.container?.message_ts,
		threadTs: payload.event?.message?.thread_ts ?? payload.event?.thread_ts,
		channelType: payload.event?.channel_type,
		assistantThread: payload.event?.assistant_thread && {
			channel_id: payload.event?.assistant_thread?.channel_id,
			thread_ts: payload.event?.assistant_thread?.thread_ts,
		},
		isAssistant: channelId?.startsWith("D"),
		target: classifyRequest(payload),
	} as SlackEventMetadata;
	console.log("METADATA", JSON.stringify(metadata));

	return { payload, metadata };
}

export function classifyRequest(
	payload: EventCallbackPayload,
	// metadata: SlackEventMetadata,
) {
	// Handle Slack verification requests
	if (payload.type === "url_verification") {
		console.log("exit[url_verification]", payload.challenge);
		return ignored;
	}
	if (payload.type === "ssl_check") {
		console.log("exit[ssl_check]");
		return ignored;
	}
	if (payload.event?.bot_profile) {
		console.log("exit[bot_profile]", payload.event.bot_profile);
		return ignored;
	}
	if (payload.event?.subtype === "file_share") {
		const file = payload.event.files?.[0];
		if (file && !SUPPORTED_MIMETYPES.includes(file.mimetype)) {
			console.log("exit[file_share_unsupported]", file.name, file.mimetype);
			return ignored;
		}
		if (file && file.size > FILE_SIZE_LIMIT) {
			console.log("exit[file_share_too_large]", file.name, file.size);
			return ignored;
		}
	}
	if (payload.event?.subtype && !extractLinks(payload.event.text).length) {
		console.log("exit[subtype]", payload.event.subtype);
		return ignored;
	}
	if (
		payload.event?.type === "message" &&
		!extractLinks(payload.event.text).length &&
		!payload.event?.channel.startsWith("D")
	) {
		console.log("exit[message]", payload.event.text);
		return ignored;
	}
	if (nakedMention(payload)) {
		console.log("exit[nakedmention]", payload.event?.text);
		return ignored;
	}
	if (payload.event?.type === "assistant_thread_context_changed") {
		console.log("exit[assistant_thread_context_changed]", payload.event.text);
		return ignored;
	}
	if (payload.event?.type === "assistant_thread_started") {
		console.log("exit[assistant_thread_started]", payload.event.text);
		return ignored;
	}
	if (
		payload.type === "block_actions" &&
		!!payload.actions.find(
			(a) => a.action_id === "nudge_reject" || a.action_id === "nudge_accept",
		)
	) {
		return "dismiss";
	}
	if (payload.type === "block_actions") {
		console.log("exit[block_actions]", JSON.stringify(payload.actions.at(0)));
		return ignored;
	}
	if (payload.event?.type === "app_mention" && payload.event?.attachments) {
		console.log("exit[app_mention_modified]", payload.event.text);
		return ignored;
	}

	if (
		extractLinks(payload.event?.text).length > 0 ||
		(payload.event?.subtype === "file_share" && payload.event?.files?.[0])
	) {
		return "annotate";
	}
	if (
		payload.event?.type === "message" ||
		payload.event?.type === "app_mention"
	) {
		return "answer";
	}

	return "unknown";
}

export function parseMessageSource(payload: Record<string, any>) {
	const teamId =
		payload.team_id ??
		payload.team?.id ??
		payload.event?.team ??
		payload.message?.team;
	const channelId =
		payload.event?.message?.channel ??
		payload.event?.channel ??
		payload.channel?.id ??
		payload.event?.assistant_thread?.context?.channel_id;

	return {
		teamId,
		channelId,
	};
}
