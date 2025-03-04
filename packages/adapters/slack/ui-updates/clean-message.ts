import { SlackV2MessageTarget } from "../../mongodb/slack/v2.models";

export async function cleanMessage(
	target: SlackV2MessageTarget,
	text: string,
	blocks: any[],
) {
	if (!target.channelId) {
		throw new Error("Channel ID not found!");
	}
	if (!target.threadTs && !target.ts) {
		throw new Error("Thread TS not found!");
	}
	if (!target.accessTokens.userToken) {
		throw new Error("Access token not found!");
	}
	if (!text) {
		throw new Error("Text not found!");
	}
	if (!blocks) {
		throw new Error("Blocks not found!");
	}

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
			blocks,
			attachments: [],
		}),
	};
	console.log("REMOVE SUMMARY", JSON.stringify(requestBody));

	const result = await fetch("https://slack.com/api/chat.update", requestBody);

	const response = await result.json();
	console.log("REMOVE SUMMARY RESPONSE", response);

	return response;
}
