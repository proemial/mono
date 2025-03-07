import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { SlackThread } from "../models/event-models";
import { SlackEventMetadata } from "../models/metadata-models";
import { normalizeYouTubeUrl, isYouTubeUrl } from "../../youtube/shared";
import { extractLinks } from "./links";
import { ContextBlock, TextObject } from "@slack/types";
import { CoreAssistantMessage, CoreMessage, CoreUserMessage } from "ai";
import { LlmUtils } from "../../llm/utils";

export async function getThreadMessagesForAi(metadata: SlackEventMetadata) {
	const messages = await getThreadMessages(
		metadata.channelId,
		metadata.threadTs as string,
		metadata.teamId,
		metadata.appId,
	);
	// console.log("input messages", JSON.stringify(messages));

	const outputMessages: CoreMessage[] = [];

	for (const message of messages) {
		const sanitized = (message.text ?? "")
			.replaceAll("\n", " ")
			.replaceAll('"', " ");
		// TODO: replace usernames such as <@U08B132LUBZ> with @username

		if (!message.bot_id) {
			// user message
			outputMessages.push({
				content: sanitized,
				role: "user",
			} satisfies CoreUserMessage);
		} else {
			const blocks = message.attachments?.[0]?.blocks as
				| ContextBlock[]
				| undefined;
			const elements = blocks?.[0]?.elements as TextObject[] | undefined;
			const answer = elements?.[0]?.text?.replace(
				// Remove inline linked references;
				/<https?:\/\/[^|>]+\|?\[?\d*\]?>/g,
				"",
			);

			// assistant message
			outputMessages.push({
				content: `${sanitized}: ${answer}`,
				role: "assistant",
			} satisfies CoreAssistantMessage);
		}

		// Handle links
		const fileUrl = message.files?.[0]?.url_private_download;
		const links = fileUrl ? [fileUrl] : extractLinks(sanitized);

		for (const l of links) {
			const link = isYouTubeUrl(l) ? normalizeYouTubeUrl(l) : l;
			const result = await SlackDb.scraped.get(link);
			if (result) {
				outputMessages.push(
					...LlmUtils.toToolCallMessagePair({
						content: `This is the full text from the ressource at ${l}: <title>${result.content.title}</title><full-text>${result.content.text}</full-text>`,
						toolName: "GetResourceFullText",
					}),
					...LlmUtils.toToolCallMessagePair({
						content: `This is a summary of the full text from the ressource at ${l}:<summary>${result.summaries?.summary}</summary>`,
						toolName: "GetSummary",
					}),
				);
			}
		}
	}
	// console.log("output messages", JSON.stringify(outputMessages));

	return outputMessages;
}

export async function getThreadMessages(
	channelId: string,
	threadTs: string,
	teamId: string,
	appId: string,
) {
	const install = await SlackDb.installs.get(teamId, appId);

	const response = await fetch(
		`https://slack.com/api/conversations.replies?channel=${channelId}&ts=${threadTs}`,
		{
			headers: {
				Authorization: `Bearer ${install?.metadata?.accessToken}`,
			},
		},
	);
	const thread = (await response.json()) as SlackThread;

	return thread.messages.filter(
		(m) => m.subtype !== "assistant_app_thread" && (m.text || m.files?.length),
	);
}
