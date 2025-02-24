import { SlackV2MessageTarget } from "../../mongodb/slack/v2.models";
import { status } from "../block-kit/status-blocks";

export async function updateStatus(
	target: SlackV2MessageTarget,
	statusText: string,
	text: string,
	isError?: boolean,
) {
	if (!target.channelId) {
		throw new Error("Channel ID not found");
	}
	if (!target.threadTs && !target.ts) {
		throw new Error("Thread TS not found");
	}
	if (!target.accessToken) {
		throw new Error("Access token not found");
	}
	if (!status) {
		throw new Error("Text not found");
	}

	const blocks = status(statusText, isError);
	const requestBody = {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${target.accessToken}`,
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
