import { SlackDb } from "../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "./models/metadata-models";
import { assistantStatus } from "./block-kit/assistant-status";

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

	const channel_id = metadata.channelId;
	const thread_ts = metadata.threadTs;
	const accessToken = install?.metadata.accessToken as string;
	console.log(
		"showSuggestions",
		metadata,
		metadata.threadTs,
		suggestions,
		title,
	);

	const result = await fetch(
		"https://slack.com/api/assistant.threads.setSuggestedPrompts",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
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

export async function setAssistantStatus(
	metadata: SlackEventMetadata | undefined,
	accessToken: string,
	status: string,
) {
	if (!metadata) {
		console.error("No metadata found");
		return;
	}

	const channel_id = metadata.channelId;
	const thread_ts = metadata.threadTs;
	const blocks = assistantStatus(status);

	const requestBody = {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			channel_id,
			thread_ts,
			...blocks,
		}),
	};
	const result = await fetch(
		"https://slack.com/api/assistant.threads.setStatus",
		requestBody,
	);
	console.log(
		"setAssistantStatus",
		JSON.stringify(requestBody),
		">",
		result.status,
		await result.json(),
	);

	return result.statusText;
}
