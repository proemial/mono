import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "../models/metadata-models";
import { slackClient } from "../slack-messenger";

export async function getChannelInfo(metadata: SlackEventMetadata) {
	const client = await slackClient(metadata);

	const channel = await client.asProem.conversations.info({
		channel: metadata.channelId,
	});

	console.log("channelInfo", channel);

	return {
		id: metadata.channelId,
		name: channel.channel?.name,
		description: channel.channel?.purpose?.value,
		topic: channel.channel?.topic?.value,
	};
}

export async function getChannelHistory(channelId: string, teamId: string) {
	const team = await SlackDb.entities.get(teamId);

	const response = await fetch(
		`https://slack.com/api/conversations.history?channel=${channelId}`,
		{
			headers: {
				Authorization: `Bearer ${team?.metadata?.accessToken}`,
			},
		},
	);
	const history = await response.json();
	const messages = history.messages
		.filter(
			(message: { text: string }) =>
				!/<@U[A-Z0-9]+> has joined the channel/.test(message.text),
		)
		.map((message: { text: string }) => message.text);

	return messages;
}
