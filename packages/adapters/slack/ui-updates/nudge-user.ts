import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { nudge } from "../block-kit/nudge-blocks";
import { SlackEventMetadata } from "../models/metadata-models";

export async function nudgeUser(
	metadata: SlackEventMetadata,
	accessToken: string,
) {
	if (!metadata.channel.id) {
		throw new Error("Channel ID not found");
	}
	if (!metadata.user) {
		throw new Error("User ID not found");
	}

	const app = await SlackDb.apps.get(metadata.appId);
	if (!app?.metadata.clientId) {
		throw new Error("Client ID not found");
	}
	console.log("app creds", metadata.appId, app?.metadata.clientId);

	const blocks = nudge(app?.metadata.clientId, metadata.teamId);
	const requestBody = {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			channel: metadata.channel.id,
			user: metadata.user,
			// threadTs is the timestamp of the message in the thread. Exclude if the message is not in a thread.
			...(metadata.threadTs && { thread_ts: metadata.threadTs }),
			...blocks,
		}),
	};

	// console.log("NUDGE USER", JSON.stringify(requestBody));
	const result = await fetch(
		"https://slack.com/api/chat.postEphemeral",
		requestBody,
	);

	return await result.json();
}
