import { SlackV2MessageTarget } from "../../mongodb/slack/v2.models";
import { status } from "../block-kit/status-blocks";

export async function updateStatus(
	target: SlackV2MessageTarget,
	statusText: string,
	text: string,
	isError?: boolean,
) {
	if (!target.channelId) {
		console.error("Channel ID not found", target);
		return;
	}
	if (!target.threadTs && !target.ts) {
		console.error("Thread TS not found", target);
		return;
	}
	if (!target.accessTokens.userToken) {
		console.error("Access token not found", target);
		return;
	}
	if (text === undefined) {
		console.error("Text not found", target);
		return;
	}

	const blocks = status(statusText, isError);
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
	console.log("ATTACH STATUS", JSON.stringify(requestBody));

	const result = await fetch("https://slack.com/api/chat.update", requestBody);
	const response = await result.json();

	return response;
}
