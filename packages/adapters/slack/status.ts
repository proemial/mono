import { SlackDb } from "../mongodb/slack/slack.adapter";
import { setAssistantStatus } from "./assistant";
import { ephemeralStatus } from "./block-kit/ephemeral-status";
import { SlackEventMetadata } from "./metadata.models";

export async function setStatus(
	metadata: SlackEventMetadata | undefined,
	status: string,
) {
	if (!metadata) {
		console.error("No metadata found");
		return;
	}

	const install = await SlackDb.installs.get(metadata.teamId, metadata.appId);
	const accessToken = install?.metadata.accessToken as string;

	if (metadata?.assistantThread) {
		const channel = metadata.assistantThread.channel_id;
		const thread = metadata.assistantThread.thread_ts;

		return await setAssistantStatus(channel, thread, accessToken, status);
	}

	// TODO: Rewrite ephemeral status message instead of posting a new every time
	// const channel = metadata.channel.id;
	// const user = metadata.user;
	// const thread = metadata.threadTs;
	// return await setEphemeralStatusMessage(
	// 	channel,
	// 	user,
	// 	thread,
	// 	accessToken,
	// 	status,
	// );
}

export async function setEphemeralStatusMessage(
	channelId: string,
	userId: string,
	threadTs: string,
	accessToken: string,
	status: string,
) {
	const channel = channelId;
	const user = userId;

	const blocks = ephemeralStatus(status);

	const result = await fetch("https://slack.com/api/chat.postEphemeral", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			channel,
			user,
			thread_ts: threadTs,
			...blocks,
		}),
	});
	console.log("setEphemeralStatusMessage", result.status, await result.json());

	return result.statusText;
}
