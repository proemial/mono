import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";

export async function getChannelHistory(channelId: string, teamId: string) {
	try {
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
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
	}
}
