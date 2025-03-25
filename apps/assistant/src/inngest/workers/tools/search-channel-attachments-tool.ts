import { statusMessages } from "@proemial/adapters/slack/helpers/status-messages";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { Tool } from "ai";
import { z } from "zod";
import { Slack } from "../helpers/slack";
import { Qdrant } from "@proemial/adapters/qdrant/qdrant";

// The score threshold for an attachment to be considered relevant to a query
const ATTACHMENT_SCORE_THRESHOLD = 0.3;

export const getSearchChannelAttachmentsTool = (metadata: SlackEventMetadata) =>
	({
		description:
			"A tool that lets you search in the contents of files and links posted in a Slack channel. You can use it to understand the context of a message or a discussion, to better answer a given question, or to provide relevant details about a given topic.",
		parameters: z.object({
			query: z
				.string()
				.describe(
					"You must generate this argument based on a user message or a discussion, to make it unambiguous and well suited to find relevant supporting information when vectorized and used as a search query against a database of file and link content. Use the original terminology from the user message or discussion, but restate the central terms multiple times, for a better match in the vector database. It is important you not use words like 'file', 'link', 'url', 'attachment', etc. in your query, as these words will not be found in the vector database.",
				),
		}),
		execute: async ({ query }) => {
			console.log("Tool invocation: Search Channel Attachments", query);
			await Slack.postDebug(
				metadata,
				`Searching channel attachments using query: "${query}"`,
			);
			await Slack.updateStatus(
				metadata,
				statusMessages.ask.searchChannelAttachments,
			);

			// Filter search results by app, team, and channel id
			const attachments = await Qdrant.search(
				{
					appId: metadata.appId,
					teamId: metadata.teamId,
					context: {
						channelId: metadata.channelId,
					},
				},
				query,
			);
			console.log("No. of attachments found", attachments.length);

			const relevantAttachments = attachments.filter(
				(attachment) => attachment.score >= ATTACHMENT_SCORE_THRESHOLD,
			);
			console.log(
				"No. of relevant attachments found (above score threshold)",
				relevantAttachments.length,
			);

			return relevantAttachments.map((attachment) => ({
				text: attachment.payload.content.text,
				type: attachment.payload.type,
				...(attachment.payload.type === "file"
					? { filename: attachment.payload.content.title }
					: {
							url: attachment.payload.url,
							title: attachment.payload.content.title,
						}),
			}));
		},
	}) satisfies Tool;
