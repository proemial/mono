import { SlackDb } from "@/mongodb/slack/slack.adapter";

export async function translateHandles(
	handles: string[],
	appId: string,
	teamId: string,
) {
	const users = handles.filter((handle) => handle.startsWith("U"));
	const channels = handles.filter((handle) => handle.startsWith("C"));

	const app = await SlackDb.installs.get(teamId, appId);
	if (!app) {
		throw new Error("App not found");
	}

	const outputs = [...handles];

	if (users.length > 0) {
		const result = await fetch("https://slack.com/api/users.list", {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${app.metadata.accessToken}`,
			},
		});

		// TODO: Replace in outputs
	}

	if (channels.length > 0) {
		const result = await fetch("https://slack.com/api/conversations.list", {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${app.metadata.accessToken}`,
			},
		});

		// TODO: Replace in outputs
	}

	return {
		users,
		channels,
	};
}
