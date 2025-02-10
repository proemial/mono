import { SlackDb } from "../mongodb/slack/slack.adapter";

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

export async function showSuggestions(
	channel_id: string,
	thread_ts: string,
	accessToken: string,
	suggestions: string[],
	title?: string,
) {
	const result = await fetch(
		"https://slack.com/api/assistant.threads.setSuggestedPrompts",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				channel_id,
				thread_ts,
				title,
				prompts: suggestions.map((suggestion) => ({
					title: suggestion,
					message: suggestion,
				})),
			}),
		},
	);

	console.log("showSuggestions", result.status, await result.json());

	return result.statusText;
}
