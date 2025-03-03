import { ignored } from "@proemial/adapters/slack/helpers/payload";
import { FILE_SIZE_LIMIT, FILE_TYPE_WHITELIST } from "./file-filters";
import { EventCallbackPayload } from "@proemial/adapters/slack/models/event-models";
import { extractLinks } from "@proemial/adapters/slack/helpers/links";
import { nakedMention } from "@proemial/adapters/slack/helpers/routing";
import { URL_BLACKLIST } from "./url-filters";
import { EventLogItem } from "@proemial/adapters/mongodb/slack/v2.models";

export function classifyRequest(
	payload: EventCallbackPayload,
	event: EventLogItem | null,
) {
	const workers = event?.requests.filter((r) => r.type.includes("worker:"));
	if (workers?.length) {
		log("exit[started]", workers.length);
		return ignored;
	}

	// Dismissal of nudges
	if (
		payload.type === "block_actions" &&
		!!payload.actions.find(
			(a) => a.action_id === "nudge_reject" || a.action_id === "nudge_accept",
		)
	) {
		return "dismiss";
	}

	// Show assistant suggestions
	if (payload.event?.type === "assistant_thread_started") {
		return "suggestions";
	}

	// Unhandled event types
	if (payload.type === "url_verification") {
		log("exit[url_verification]", payload.challenge);
		return ignored;
	}
	if (payload.type === "ssl_check") {
		log("exit[ssl_check]");
		return ignored;
	}
	if (payload.event?.bot_profile) {
		log("exit[bot_profile]");
		return ignored;
	}
	if (payload.event?.subtype === "file_share") {
		const file = payload.event.files?.[0];
		if (file && !FILE_TYPE_WHITELIST.includes(file.mimetype)) {
			log("exit[file_share_unsupported]", file.name, file.mimetype);
			return ignored;
		}
		if (file && file.size > FILE_SIZE_LIMIT) {
			log("exit[file_share_too_large]", file.name, file.size);
			return ignored;
		}
	}
	if (payload.event?.subtype && !extractLinks(payload.event.text).length) {
		log(
			"exit[subtype]",
			payload.event.subtype,
			!extractLinks(payload.event.text).length,
		);
		return ignored;
	}
	if (payload.event?.type === "assistant_thread_context_changed") {
		log("exit[assistant_thread_context_changed]");
		return ignored;
	}
	if (payload.type === "block_actions") {
		log("exit[block_actions]");
		return ignored;
	}

	// Annotation of links and files
	if (
		payload.event?.type === "message" &&
		!extractLinks(payload.event.text, URL_BLACKLIST).length &&
		!payload.event?.channel.startsWith("D")
	) {
		log(
			"exit[message]",
			payload.event?.type,
			!extractLinks(payload.event.text, URL_BLACKLIST).length,
			payload.event?.channel,
		);
		return ignored;
	}

	if (
		extractLinks(payload.event?.text, URL_BLACKLIST).length > 0 ||
		(payload.event?.subtype === "file_share" && payload.event?.files?.[0])
	) {
		return "annotate";
	}

	if (nakedMention(payload)) {
		return "nudge";
	}

	// Answer to a questions
	if (payload.event?.type === "app_mention" && payload.event?.attachments) {
		log(
			"exit[app_mention_modified]",
			payload.event?.type === "app_mention",
			payload.event?.attachments?.length,
		);
		return ignored;
	}
	if (
		payload.event?.type === "message" ||
		payload.event?.type === "app_mention"
	) {
		return "answer";
	}

	return "unknown";
}

function log(message: string, ...args: unknown[]) {
	console.log(`EXIT: ${message}`, ...args);
}
