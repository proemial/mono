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
		log("already started", workers.length);
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

	if (payload.event?.type === "assistant_thread_started") {
		return "suggestions";
	}

	if (
		extractLinks(payload.event?.text, URL_BLACKLIST).length > 0 ||
		(payload.event?.subtype === "file_share" && payload.event?.files?.[0])
	) {
		return "annotate";
	}

	// Mention or user message in assistant thread
	if (
		payload.event?.type === "app_mention" ||
		(payload.event?.channel.startsWith("D") &&
			payload.event.user !== payload.event.parent_user_id)
	) {
		return "answer";
	}

	log("unhandled", payload.type, payload.event?.type);

	return ignored;
}

function log(message: string, ...args: unknown[]) {
	console.log(`IGNORE: ${message}`, ...args);
}
