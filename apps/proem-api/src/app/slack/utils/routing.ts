import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";

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

	const team = await SlackDb.entities.get(teamId);
	if (!team) {
		throw new Error("Team not found");
	}
	if (!team.metadata?.accessToken) {
		throw new Error("Token not found");
	}

	return {
		url: "https://slack.com/api/chat.postMessage",
		headers: {
			Authorization: `Bearer ${team.metadata?.accessToken}`,
		},
		body: {
			channel,
		},
	};
}

type Target = {
	url: string;
	headers: Partial<Record<string, string>>;
	body: Partial<Record<string, string>>;
};
