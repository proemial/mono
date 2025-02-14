import { EventType, EventSource } from "../mongodb/slack/events.types";
import { SlackDb } from "../mongodb/slack/slack.adapter";
import { annotatedLink } from "./block-kit/annotated-link";
import { SlackEventMetadata } from "./metadata.models";
import { getTarget } from "./routing";

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

export async function postAnnotation(
	metadata: SlackEventMetadata,
	threadTs: string,
	summary: string,
	source: EventSource,
	type: EventType,
) {
	if (!metadata) {
		throw new Error("Metadata not found");
	}
	if (!threadTs) {
		throw new Error("Thread TS not found");
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

	const blocks = annotatedLink(metadata.channel.id, threadTs, summary);

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
			"Content-Type": "application/json",
			...target.headers,
		},
		body: JSON.stringify(blocks),
	});
}
