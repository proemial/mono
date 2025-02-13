import { SlackDb } from "../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "./metadata.models";

export async function showSuggestions(
	metadata: SlackEventMetadata | undefined,
	suggestions: string[],
	title?: string,
) {
	if (!metadata?.assistantThread) {
		console.error("No assistant thread found");
		return;
	}

	if (!metadata) {
		console.error("No metadata found");
		return;
	}

	const install = await SlackDb.installs.get(metadata.teamId, metadata.appId);

	const channel_id = metadata.assistantThread.channel_id;
	const thread_ts = metadata.assistantThread.thread_ts;
	const accessToken = install?.metadata.accessToken as string;
	console.log(
		"showSuggestions",
		metadata,
		metadata.assistantThread,
		suggestions,
		title,
	);

	const result = await fetch(
		"https://slack.com/api/assistant.threads.setSuggestedPrompts",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				channel_id,
				thread_ts,
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

export async function setStatus(
	metadata: SlackEventMetadata | undefined,
	status: string,
) {
	if (!metadata) {
		console.error("No metadata found");
		return;
	}

	const install = await SlackDb.installs.get(metadata.teamId, metadata.appId);

	if (!metadata?.assistantThread) {
		console.error("No assistant thread found");
		return;
	}
	const channel_id = metadata.assistantThread.channel_id;
	const thread_ts = metadata.assistantThread.thread_ts;
	const accessToken = install?.metadata.accessToken as string;

	const result = await fetch(
		"https://slack.com/api/assistant.threads.setStatus",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				channel_id,
				thread_ts,
				status,
			}),
		},
	);
	console.log("setStatus", result.status, await result.json());

	return result.statusText;
}
