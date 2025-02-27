import { SlackV2MessageTarget } from "../../mongodb/slack/v2.models";
import { answer } from "../block-kit/answer-blocks";
import { link } from "../block-kit/link-blocks";

export async function sendMessage(
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
	if (!target.accessTokens.teamToken) {
		throw new Error("Team token not found");
	}
	if (text === undefined) {
		throw new Error("Text not found");
	}

	const blocks = answer(summary, url, title);
	const requestBody = {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${target.accessTokens.teamToken}`,
		},
		body: JSON.stringify({
			channel: target.channelId,
			// Always use ts, but use the one from the channel message if it exists
			thread_ts: target.ts,
			...blocks,
		}),
	};

	const result = await fetch(
		"https://slack.com/api/chat.postMessage",
		requestBody,
	);
	const response = await result.json();

	return response;
}
