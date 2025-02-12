import { SlackDb } from "../mongodb/slack/slack.adapter";
import { EventCallbackPayload } from "./event.model";

export async function showSuggestions(
	payload: EventCallbackPayload,
	suggestions: string[],
	title?: string,
) {
	const install = await SlackDb.installs.get(
		payload.team_id as string,
		payload.api_app_id,
	);

	const channel_id = payload.event.assistant_thread?.channel_id as string;
	const thread_ts = payload.event.assistant_thread?.thread_ts as string;
	const accessToken = install?.metadata.accessToken as string;

	console.log("showSuggestions", channel_id, thread_ts, accessToken, title);
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

export async function setStatus(payload: EventCallbackPayload, status: string) {
	const install = await SlackDb.installs.get(
		payload.team_id as string,
		payload.api_app_id,
	);

	const channel_id = payload.event.assistant_thread?.channel_id as string;
	const thread_ts = payload.event.assistant_thread?.thread_ts as string;
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
