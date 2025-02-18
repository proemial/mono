import { EventType, EventSource } from "../mongodb/slack/events.types";
import { SlackDb } from "../mongodb/slack/slack.adapter";
import { answer } from "./block-kit/answer-blocks";
import { SlackEventMetadata } from "./metadata.models";
import { getTarget } from "./helpers/routing";
import { postLinkSummary } from "./link-summary";

export async function setStatus(
	metadata: SlackEventMetadata | undefined,
	status: string,
) {
	return await postLinkSummary(
		metadata,
		{ status },
		"assistant",
		"AnnotateEvent",
	);
}

export async function postAnswer(
	metadata: SlackEventMetadata | undefined,
	summary: string,
	source: EventSource,
	type: EventType,
) {
	if (!metadata) {
		throw new Error("Metadata not found");
	}
	if (!summary) {
		throw new Error("Summary not found");
	}
	if (!source) {
		throw new Error("Source not found");
	}
	if (!type) {
		throw new Error("Type not found");
	}

	const blocks = answer(metadata.channel.id, metadata.threadTs, summary);

	await SlackDb.events.insert({
		createdAt: new Date(),
		metadata,
		source,
		type,
		payload: blocks,
	});

	const target = await getTarget({ metadata, payload: blocks });
	return await fetch(target.url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			...target.headers,
		},
		body: JSON.stringify(blocks),
	});
}
