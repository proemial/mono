import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { link } from "../block-kit/link-blocks";
import { nudge } from "../block-kit/nudge-blocks";
import { SlackEventMetadata } from "../models/metadata-models";

export async function nudgeUser(
	metadata: SlackEventMetadata,
	accessToken: string,
	text?: string,
	url?: string,
	title?: string,
) {
	if (!metadata.channelId) {
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

	const requestBody = (
		content: ReturnType<typeof link> | ReturnType<typeof nudge>,
	) => ({
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			channel: metadata.channelId,
			user: metadata.user,
			// threadTs is the timestamp of the message in the thread. Exclude if the message is not in a thread.
			...(metadata.threadTs && { thread_ts: metadata.threadTs }),
			...content,
		}),
	});

	// TODO: Show result as ephemeral message also
	const blocks1 = link(text as string, url as string, title as string);
	const preview = await fetch(
		"https://slack.com/api/chat.postEphemeral",
		requestBody(blocks1),
	).then((res) => res.json());

	const blocks = nudge(app?.metadata.clientId, metadata.teamId);
	const invitation = await fetch(
		"https://slack.com/api/chat.postEphemeral",
		requestBody(blocks),
	).then((res) => res.json());

	return {
		preview,
		invitation,
	};
}
