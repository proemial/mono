import {
	Classification,
	PartialMetadata,
} from "@proemial/adapters/slack/helpers/payload";
import { FILE_SIZE_LIMIT, FILE_TYPE_WHITELIST } from "./file-filters";
import { EventCallbackPayload } from "@proemial/adapters/slack/models/event-models";
import { extractLinks } from "@proemial/adapters/slack/helpers/links";
import { nakedMention } from "@proemial/adapters/slack/helpers/routing";
import { URL_BLACKLIST } from "./url-filters";
import { EventLogItem } from "@proemial/adapters/mongodb/slack/v2.models";
import { Time } from "@proemial/utils/time";
import { unstable_cache as cache } from "next/cache";
import { errorMessage } from "@proemial/adapters/slack/error-messages";
import { EnvVars } from "@proemial/utils/env-vars";
import { classifyQuestion } from "@/prompts/question/classify-question";
import { Slack } from "@/inngest/workers/helpers/slack";

export const ignored = { type: "ignored" } as Classification;

export async function classifyRequest(
	payload: EventCallbackPayload,
	metadata: PartialMetadata,
	event: EventLogItem | null,
): Promise<Classification> {
	const workers = event?.requests.filter((r) => r.type.includes("worker:"));
	if (workers?.length) {
		log("Already started, workers:", workers.length);
		return ignored;
	}
	const isDuplicate = await isDuplicateEvent(payload);
	if (isDuplicate) {
		console.log("Already started, eventId:", payload.event_id);
		return ignored;
	}

	if (
		payload.type === "block_actions" &&
		!!payload.actions.find((a) => a.action_id === "followup-question")
	) {
		return { type: "followup" };
	}
	if (
		payload.type === "block_actions" &&
		!!payload.actions.find((a) => a.action_id === "ask_question")
	) {
		return { type: "ask_question" };
	}
	if (
		payload.type === "block_actions" &&
		!!payload.actions.find((a) => a.action_id === "post_link")
	) {
		return { type: "post_link" };
	}

	if (payload.event?.type === "assistant_thread_started") {
		return { type: "suggestions" };
	}

	if (payload.event?.subtype === "file_share") {
		const file = payload.event?.files?.[0];
		if (file) {
			if (!FILE_TYPE_WHITELIST.includes(file.mimetype)) {
				log("unsupported file type", file.mimetype, file.size);
				return {
					type: "error",
					payload: errorMessage.unsupportedFile(file.mimetype),
				};
			}
			if (file.size > FILE_SIZE_LIMIT) {
				log("file too large", file.mimetype, file.size);
				return {
					type: "error",
					payload: errorMessage.fileTooLarge(file.size),
				};
			}
			return { type: "annotate" };
		}
	}

	const isBot = payload.event?.bot_profile;
	const hasLinks = extractLinks(payload.event?.text, URL_BLACKLIST).length > 0;
	const tagged = await isQuestion(payload, metadata);

	if (!isBot && !tagged && hasLinks) {
		return { type: "annotate" };
	}

	const assistant =
		payload.event?.channel.startsWith("D") &&
		payload.event?.user !== payload.event.parent_user_id;
	const botRemoved = payload.event?.user === "USLACKBOT";

	if ((tagged || assistant) && !hasLinks && !botRemoved) {
		return { type: "answer" };
	}

	// if (payload.event?.subtype === "channel_join") {
	// 	return { type: "welcome" };
	// }

	log("unhandled", payload.type, payload.event?.type);

	return ignored;
}

async function isQuestion(
	payload: EventCallbackPayload,
	metadata: PartialMetadata,
) {
	const tagged =
		!nakedMention(payload) && payload.event?.type === "app_mention";

	if (tagged) return true;

	// Disabled untagged answering for now, as it's not working properly
	// ---------------------------------------------------------------
	// const text = payload.event?.text;
	// if (
	// 	EnvVars.isInternalSlackApp(metadata.appId) &&
	// 	!payload.event?.bot_profile &&
	// 	text
	// ) {
	// 	const result = await classifyQuestion(text);

	// 	Slack.postDebug(
	// 		{ ...metadata, target: "question", callback: "" },
	// 		`Message classifier: ${JSON.stringify(result)}`,
	// 	);

	// 	return result.answer;
	// }

	return false;
}

// Slack sometimes send an event twice :/
async function isDuplicateEvent(payload: EventCallbackPayload) {
	const begin = Time.now();

	const isAction = payload.type === "block_actions";
	const startedAt = await cache(
		async () => begin,
		["slack:event", payload.event_id],
	)();

	if (!isAction && startedAt !== begin) {
		return true;
	}
	return false;
}

function log(message: string, ...args: unknown[]) {
	console.log(`IGNORE: ${message}`);
}
