import { SlackDb } from "../mongodb/slack/slack.adapter";

export async function logCriticalError(message: string) {
	const install = await SlackDb.installs.get("T05A541540J", "A08AD1FSPHV"); // proemial, proem
	if (!install) {
		throw new Error("Install not found");
	}

	const result = await fetch("https://slack.com/api/chat.postMessage", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${install.metadata?.accessToken}`,
		},
		body: JSON.stringify({
			channel: "C078ZRL63FB", // tech-notifications
			text: message,
		}),
	});
	const json = await result.json();
	console.log("JSON", json);
}
