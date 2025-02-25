import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { getChannelInfo } from "./channel";
import { nakedMention } from "./routing";
import { uuid } from "@proemial/utils/uid";
import { EventCallbackPayload } from "../models/event-models";
import { SlackEventMetadata } from "../models/metadata-models";
import { extractLinks } from "./links";
import { SUPPORTED_MIMETYPES } from "../files/constants";
import { FILE_SIZE_LIMIT } from "../files/constants";

export async function parseRequest(text: string) {
	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text?.startsWith("ssl_check=")
			? decodeURIComponent(text.slice(10))
			: text;

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
		ts: payload.event?.ts,
		threadTs: payload.event?.thread_ts,
		channelType: payload.event?.channel_type,
		assistantThread: payload.event?.assistant_thread && {
			channel_id: payload.event?.assistant_thread?.channel_id,
			thread_ts: payload.event?.assistant_thread?.thread_ts,
		},
		isAssistant: channel?.id?.startsWith("D"),
	} as SlackEventMetadata;
	console.log("METADATA", JSON.stringify(metadata));

	const type = classifyRequest(payload, metadata);

	// console.log(
	// 	"METADATA",
	// 	JSON.stringify({
	// 		type,
	// 		teamId,
	// 		channelId,
	// 		user: payload.event?.user,
	// 		ts: payload.event?.ts,
	// 		threadTs: payload.event?.thread_ts,
	// 		assistantThread: payload.event?.assistant_thread && {
	// 			channel_id: payload.event?.assistant_thread?.channel_id,
	// 			thread_ts: payload.event?.assistant_thread?.thread_ts,
	// 		},
	// 	}),
	// );

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
	if (payload.event?.subtype === "file_share") {
		const file = payload.event.files?.[0];
		if (file && !SUPPORTED_MIMETYPES.includes(file.mimetype)) {
			console.log("exit[file_share_unsupported]", file.name, file.mimetype);
			return "ignore";
		}
		if (file && file.size > FILE_SIZE_LIMIT) {
			console.log("exit[file_share_too_large]", file.name, file.size);
			return "ignore";
		}
		return undefined;
	}
	if (payload.event?.subtype && !extractLinks(payload.event.text).length) {
		console.log("exit[subtype]", payload.event.subtype);
		return "ignore";
	}
	if (
		payload.event?.type === "message" &&
		!extractLinks(payload.event.text).length &&
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
	if (
		payload.type === "block_actions"
		//  && payload.actions.at(0)?.action_id === "CKwTE"
	) {
		console.log("exit[block_actions]", JSON.stringify(payload.actions.at(0)));
		return "ignore";
	}
	if (payload.event?.type === "app_mention" && payload.event?.attachments) {
		console.log("exit[app_mention_modified]", payload.event.text);
		return "ignore";
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
