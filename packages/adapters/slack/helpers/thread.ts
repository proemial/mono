import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "../models/metadata-models";
import { normalizeYouTubeUrl, isYouTubeUrl } from "../../youtube/shared";
import { extractLinks } from "./links";
import { CoreAssistantMessage, CoreMessage, CoreUserMessage } from "ai";
import { LlmUtils } from "../../llm/utils";
import { isStatusMessage } from "./status-messages";
import { ScrapedUrl } from "../../mongodb/slack/scraped.types";
import { WebClient } from "@slack/web-api";
import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsRepliesResponse";

export async function getThreadMessagesForAi(metadata: SlackEventMetadata) {
	const messages = await getThreadMessages(
		metadata.channelId,
		metadata.threadTs as string,
		metadata.teamId,
		metadata.appId,
	);

	// console.log("input messages", JSON.stringify(messages));
	const outputMessages = (
		await Promise.all(messages.map(transformToCoreMessages))
	)
		.filter((m) => m.length > 0)
		.flat();

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
	console.log("fetching conversations.replies", channelId, threadTs);
	const slack = new WebClient(install?.metadata?.accessToken);

	const thread = await slack.conversations.replies({
		channel: channelId,
		ts: threadTs,
	});

	return (thread.messages || []).filter(
		// @ts-ignore
		(m) => m.subtype !== "assistant_app_thread" && (m.text || m.files?.length),
	);
}

const getMessageUrls = (message: MessageElement): string[] => {
	const sanitized = (message.text ?? "")
		.replaceAll("\n", " ")
		.replaceAll('"', " ");
	const fileUrl = message.files?.[0]?.url_private_download;
	const links = fileUrl ? [fileUrl] : extractLinks(sanitized);
	return links.map((l) => (isYouTubeUrl(l) ? normalizeYouTubeUrl(l) : l));
};

const transformToCoreMessages = async (
	message: MessageElement,
): Promise<CoreMessage[]> => {
	// User URL messages
	const urls = await Promise.all(
		getMessageUrls(message).map(async (url) => {
			const result = await SlackDb.scraped.get(url);
			return result;
		}),
	);

	return toCoreMessages(
		message,
		urls.filter((r) => !!r),
	);
};

// TODO: Generate unit test for this function
export const toCoreMessages = (
	message: MessageElement,
	urls: Pick<ScrapedUrl, "url" | "content" | "summaries">[],
) => {
	if (urls.length > 0) {
		return urls
			.filter((r) => r !== null)
			.flatMap((r) => [
				...(message.text
					? [
							{
								content: message.text,
								role: "user",
							} satisfies CoreUserMessage,
						]
					: []),
				...LlmUtils.toToolCallMessagePair(
					`This is the full text from the ressource at ${r.url}: <title>${r.content.title}</title><full-text>${r.content.text}</full-text>`,
					"GetResourceFullText",
					{ arg: r.url },
				),
				...LlmUtils.toToolCallMessagePair(
					`This is a summary of the full text from the ressource at ${r.url}:<summary>${r.summaries?.summary}</summary>`,
					"GetSummary",
					{ arg: r.url },
				),
			]);
	}

	// Ignore empty messages that are not files (handled above)
	if (!message.text) {
		return [];
	}

	// User plain text messages
	// @ts-ignore We need to ignore this typing error, as username will be there when the
	// bot is posting with a custom avatar, which is what we do on followups
	if (!message.bot_id || message.username) {
		return [
			{
				content: message.text,
				role: "user",
			} satisfies CoreUserMessage,
		];
	}

	// Assistant messages
	if (message.bot_id) {
		// Gemini models sometimes return an empty string, if we include status messages
		if (isStatusMessage(message.text)) {
			return [];
		}
		const answer = message.text.replace(
			// Remove inline linked references
			/<https?:\/\/[^|>]+\|?\[?\d*\]?>/g,
			"",
		);

		return [
			{
				content: answer,
				role: "assistant",
			} satisfies CoreAssistantMessage,
		];
	}

	return [];
};
