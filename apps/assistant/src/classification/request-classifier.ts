import { ignored } from "@proemial/adapters/slack/helpers/payload";
import { FILE_SIZE_LIMIT, FILE_TYPE_WHITELIST } from "./file-filters";
import { EventCallbackPayload } from "@proemial/adapters/slack/models/event-models";
import { extractLinks } from "@proemial/adapters/slack/helpers/links";
import { nakedMention } from "@proemial/adapters/slack/helpers/routing";
import { URL_BLACKLIST } from "./url-filters";

export function classifyRequest(payload: EventCallbackPayload) {
	// Annotation of links and files
	if (
		payload.event?.type === "message" &&
		!extractLinks(payload.event.text, URL_BLACKLIST).length &&
		!payload.event?.channel.startsWith("D")
	) {
		console.log("exit[message]", payload.event.text);
		return ignored;
	}
	if (
		extractLinks(payload.event?.text, URL_BLACKLIST).length > 0 ||
		(payload.event?.subtype === "file_share" && payload.event?.files?.[0])
	) {
		return "annotate";
	}

	// Answer to a questions
	if (nakedMention(payload)) {
		console.log("exit[nakedmention]", payload.event?.text);
		return ignored;
	}
	if (payload.event?.type === "app_mention" && payload.event?.attachments) {
		console.log("exit[app_mention_modified]", payload.event.text);
		return ignored;
	}
	if (
		payload.event?.type === "message" ||
		payload.event?.type === "app_mention"
	) {
		return "answer";
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
		if (file && !FILE_TYPE_WHITELIST.includes(file.mimetype)) {
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
	if (payload.event?.type === "assistant_thread_context_changed") {
		console.log("exit[assistant_thread_context_changed]", payload.event.text);
		return ignored;
	}
	if (payload.type === "block_actions") {
		console.log("exit[block_actions]", JSON.stringify(payload.actions.at(0)));
		return ignored;
	}

	return "unknown";
}
