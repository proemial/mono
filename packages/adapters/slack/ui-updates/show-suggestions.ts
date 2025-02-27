import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "../models/metadata-models";

export async function showSuggestions(
	metadata: SlackEventMetadata | undefined,
	suggestions: string[],
	title?: string,
) {
	if (!metadata) {
		console.error("No metadata found");
		return;
	}

	const install = await SlackDb.installs.get(metadata.teamId, metadata.appId);
	const accessToken = install?.metadata.accessToken as string;

	const result = await fetch(
		"https://slack.com/api/assistant.threads.setSuggestedPrompts",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				channel_id: metadata.channelId,
				thread_ts: metadata.threadTs,
				title,
				prompts: suggestions.map((suggestion) => ({
					title: suggestion,
					message: suggestion,
				})),
			}),
		},
	);
	console.log("showSuggestions", result.status, await result.json());

	return result.statusText;
}
