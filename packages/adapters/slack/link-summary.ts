import { EventType, EventSource } from "../mongodb/slack/events.types";
import { SlackDb } from "../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "./models/metadata-models";
import { getTarget } from "./helpers/routing";
import { setAssistantStatus } from "./assistant";
import { link } from "./block-kit/link-blocks";

export async function setStatus(
	metadata: SlackEventMetadata | undefined,
	status: string,
) {
	return await postLinkSummary(
		metadata,
		{ status },
		"assistant",
		"AnnotateEvent",
	);
}

export async function postLinkSummary(
	metadata: SlackEventMetadata | undefined,
	content: {
		summary?: string;
		status?: string;
	},
	source: EventSource,
	type: EventType,
) {
	console.log("POST", metadata, content, source, type);
	if (!metadata) {
		throw new Error("Metadata not found");
	}
	if (!content.summary && !content.status) {
		throw new Error("Summary or status not found");
	}
	if (!source) {
		throw new Error("Source not found");
	}
	if (!type) {
		throw new Error("Type not found");
	}

	if (content.status) {
		const install = await SlackDb.installs.get(metadata.teamId, metadata.appId);
		if (!install) {
			throw new Error("Install not found");
		}
		if (!install.metadata?.accessToken) {
			throw new Error("Token not found");
		}

		if (metadata?.assistantThread) {
			const channel = metadata.assistantThread.channel_id;
			const thread = metadata.assistantThread.thread_ts;

			const result = await setAssistantStatus(
				channel,
				thread,
				install.metadata.accessToken,
				content.status,
			);
			// console.log("STATUS", result);
			return result;
		}
		// const blocks = link(metadata.channel.id, metadata.threadTs, content.status);
		// console.log("STATUS BODY", JSON.stringify(blocks));

		// const result = await fetch("https://slack.com/api/chat.postMessage", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json; charset=utf-8",
		// 		Authorization: `Bearer ${install.metadata?.accessToken}`,
		// 	},
		// 	body: JSON.stringify(blocks),
		// });

		// const json = await result.json();
		// console.log("STATUS", json);
		// return json;
		return {};
	}

	if (content.summary) {
		const blocks = link(
			metadata.channel.id,
			metadata.threadTs,
			content.summary,
		);

		await SlackDb.events.insert({
			createdAt: new Date(),
			metadata,
			source,
			type,
			payload: blocks,
		});

		const target = await getTarget({ metadata, payload: blocks });
		// console.log("SUMMARY BODY", JSON.stringify(blocks));

		const result = await fetch(target.url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				...target.headers,
			},
			body: JSON.stringify(blocks),
		});
		const json = await result.json();
		console.log("POST", json);
		return json;
	}

	throw new Error("No summary or status found");
}
