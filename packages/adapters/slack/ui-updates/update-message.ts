import { SlackV2MessageTarget } from "../../mongodb/slack/v2.models";
import { link } from "../block-kit/link-blocks";
import { SlackResponse } from "../models/event-models";

export async function updateMessage(
	target: SlackV2MessageTarget,
	text: string,
	summary: string,
	url?: string,
	title?: string,
) {
	if (!target.channelId) {
		throw new Error("Channel ID not found");
	}
	if (!target.threadTs && !target.ts) {
		throw new Error("Thread TS not found");
	}
	if (!target.accessTokens.userToken) {
		throw new Error("Access token not found");
	}
	if (text === undefined) {
		throw new Error("Text not found");
	}

	const blocks = link(summary, url, title);
	const requestBody = {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${target.accessTokens.userToken}`,
		},
		body: JSON.stringify({
			channel: target.channelId,
			// Always use ts, but use the one from the channel message if it exists
			ts: target.ts,
			text,
			...blocks,
		}),
	};

	const result = await fetch("https://slack.com/api/chat.update", requestBody);
	const response = (await result.json()) as SlackResponse;

	return response;
}
