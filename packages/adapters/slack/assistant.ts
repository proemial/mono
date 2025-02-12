export async function showSuggestions(
	channel_id: string,
	thread_ts: string,
	accessToken: string,
	suggestions: string[],
	title?: string,
) {
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
