import { EventType, EventSource } from "../mongodb/slack/events.types";
import { SlackDb } from "../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "./metadata.models";
import { getTarget } from "./routing";

export function parseMessageSource(payload: Record<string, any>) {
	const teamId =
		payload.team_id ??
		payload.team?.id ??
		payload.event.team ??
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

	const blocks = annotatedLinkBlock(metadata.channel.id, threadTs, summary);

	const updated = await SlackDb.events.insert({
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
const annotatedLinkBlock = (
	channelId: string,
	threadTs: string,
	summary: string,
) => ({
	channel: channelId,
	thread_ts: threadTs,
	unfurl_links: false,
	blocks: [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: summary,
			},
			accessory: {
				type: "static_select",
				placeholder: {
					type: "plain_text",
					text: "Actions",
					emoji: true,
				},
				options: [
					{
						text: {
							type: "plain_text",
							text: "Dive deeper",
							emoji: true,
						},
						value: "expand",
					},
					{
						text: {
							type: "plain_text",
							text: "Find relevant research",
							emoji: true,
						},
						value: "expand",
					},
					{
						text: {
							type: "plain_text",
							text: "Follow-up questions",
							emoji: true,
						},
						value: "follow-ups",
					},
					{
						text: {
							type: "plain_text",
							text: "Counter argument",
							emoji: true,
						},
						value: "counter-argument",
					},
				],
				action_id: "actions",
			},
		},
	],
});
