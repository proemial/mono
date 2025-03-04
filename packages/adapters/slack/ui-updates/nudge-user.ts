import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { link } from "../block-kit/link-blocks";
import { nudge } from "../block-kit/nudge-blocks";
import { SlackResponse } from "../models/event-models";
import { SlackEventMetadata } from "../models/metadata-models";

export async function nudgeUser(metadata: SlackEventMetadata) {
	if (!metadata.channelId) {
		throw new Error("Channel ID not found");
	}
	if (!metadata.user) {
		throw new Error("User ID not found");
	}

	const installs = await SlackDb.installs.getTokensForUserAndTeam(
		metadata.teamId,
		metadata.appId,
		metadata.user,
	);
	if (installs.userToken) {
		return {
			ok: true,
			status: "ignored",
		} as SlackResponse;
	}
	if (!installs.teamToken) {
		throw new Error("Team install not found");
	}

	const app = await SlackDb.apps.get(metadata.appId);
	if (!app?.metadata.clientId) {
		throw new Error("Client ID not found");
	}

	const requestBody = (
		content: ReturnType<typeof link> | ReturnType<typeof nudge>,
	) => ({
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${installs.teamToken}`,
		},
		body: JSON.stringify({
			channel: metadata.channelId,
			user: metadata.user,
			// threadTs is the timestamp of the message in the thread. Exclude if the message is not in a thread.
			...(metadata.threadTs && { thread_ts: metadata.threadTs }),
			...content,
		}),
	});

	const blocks = nudge(app?.metadata.clientId, metadata.teamId);
	const response = await fetch(
		"https://slack.com/api/chat.postEphemeral",
		requestBody(blocks),
	).then((res) => res.json());

	return response as SlackResponse;
}
