import { SlackDb } from "../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "./metadata.models";
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function nakedLink(payload: any): string | undefined {
	const text = payload?.event?.text;
	const match = text?.match(/^<https?:\/\/[^\s]+>$/);

	return match ? match[0].slice(1, -1) : undefined;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function nakedMention(payload: any): boolean {
	const text = payload?.event?.text;
	const match = text?.match(/^<@[^\s]+>$/);

	return match;
}

export async function getTarget(body: {
	metadata: SlackEventMetadata;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	payload: any;
}): Promise<Target> {
	if (body.payload.response_url) {
		// TODO: Add thread_ts
		return {
			url: body.payload.response_url,
			headers: {},
			body: {},
		};
	}

	const channelId =
		body.metadata.channel.id ??
		body.payload?.event?.channel ??
		body.payload?.channel;
	if (!channelId) {
		throw new Error("Channel not found");
	}

	const teamId = body.metadata.teamId;
	if (!teamId) {
		throw new Error("TeamId not found");
	}

	const appId = body.metadata.appId;
	if (!appId) {
		throw new Error("AppId not found");
	}

	const install = await SlackDb.installs.get(teamId, appId);
	if (!install) {
		throw new Error("Install not found");
	}
	if (!install.metadata?.accessToken) {
		throw new Error("Token not found");
	}

	return {
		url: "https://slack.com/api/chat.postMessage",
		headers: {
			Authorization: `Bearer ${install.metadata?.accessToken}`,
		},
		body: {
			channel: channelId,
		},
	};
}

export type Target = {
	url: string;
	headers: Partial<Record<string, string>>;
	body: Partial<Record<string, string>>;
};
