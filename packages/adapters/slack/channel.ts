import { uuid } from "@proemial/utils/uid";
import { SlackDb } from "../mongodb/slack/slack.adapter";
import { SlackThread } from "./event.model";

export async function getChannelInfo(teamId: string, channelId: string) {
	if (!teamId || !channelId) {
		return {};
	}
	const team = await SlackDb.entities.get(teamId);

	const channel = await fetch(
		`https://slack.com/api/conversations.info?channel=${channelId}`,
		{
			headers: {
				Authorization: `Bearer ${team?.metadata?.accessToken}`,
			},
		},
	);
	const channelInfo = await channel.json();

	return {
		channel: {
			id: channelId,
			name: channelInfo.channel?.name,
			description: channelInfo.channel?.purpose?.value,
			topic: channelInfo.channel?.topic?.value,
		},
		team: {
			id: teamId,
			name: team?.name,
			description: team?.description,
		},
		token: team?.metadata?.accessToken,
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

export async function getThreadMessages(
	channelId: string,
	threadTs: string,
	teamId: string,
	appId: string,
) {
	const install = await SlackDb.installs.get(teamId, appId);

	const response = await fetch(
		`https://slack.com/api/conversations.replies?channel=${channelId}&ts=${threadTs}`,
		{
			headers: {
				Authorization: `Bearer ${install?.metadata?.accessToken}`,
			},
		},
	);
	const thread = (await response.json()) as SlackThread;

	return thread.messages;
}

export async function getThreadMessagesForAi(
	channelId: string,
	threadTs: string,
	teamId: string,
	appId: string,
) {
	const messages = await getThreadMessages(channelId, threadTs, teamId, appId);

	return messages
		.filter((m) => m.subtype !== "assistant_app_thread" && m.text)
		.map((m) => ({
			id: uuid(),
			createdAt: new Date(Number.parseFloat(m.ts) * 1000),
			content: (m.text ?? "").replaceAll("\n", " ").replaceAll('"', " "),
			role: m.bot_id ? "assistant" : "user",
		}));
}
