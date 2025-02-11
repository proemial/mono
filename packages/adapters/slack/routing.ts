import { SlackDb } from "../mongodb/slack/slack.adapter";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function isNakedLink(payload: any): boolean {
	const text = payload?.event?.text;
	const isNakedLink = text?.match(/^<https?:\/\/[^\s]+>$/);

	return isNakedLink;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function isNakedMention(payload: any): boolean {
	const text = payload?.event?.text;
	const isNakedMention = text?.match(/^<@[^\s]+>$/);

	return isNakedMention;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function getTarget(body: any): Promise<Target> {
	if (body.payload.response_url) {
		// TODO: Add thread_ts
		return {
			url: body.response_url,
			headers: {},
			body: {},
		};
	}

	const channel = body.payload?.event?.channel ?? body.payload?.channel;
	if (!channel) {
		throw new Error("Channel not found");
	}

	const teamId = (body.metadata.teamId ?? body.payload.team_id) as string;
	if (!teamId) {
		throw new Error("TeamId not found");
	}

	const appId = (body.metadata.appId ?? body.payload.api_app_id) as string;
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
			channel,
		},
	};
}

export type Target = {
	url: string;
	headers: Partial<Record<string, string>>;
	body: Partial<Record<string, string>>;
};
