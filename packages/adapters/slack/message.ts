import { EventType, EventSource } from "@/mongodb/slack/events.types";
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
	const payload = annotatedLinkBlock(metadata.channel.id, threadTs, summary);

	const updated = await SlackDb.events.insert({
		createdAt: new Date(),
		metadata,
		source,
		type,
		payload,
	});
	console.log(updated);

	const target = await getTarget({ metadata, payload });
	console.log(target);

	return await fetch(target.url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...target.headers,
		},
		body: JSON.stringify({ ...target.body, ...payload }),
	});
}
const annotatedLinkBlock = (
	channelId: string,
	threadTs: string,
	summary: string,
) => ({
	payload: {
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
	},
});
