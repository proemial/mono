import { statusMessages } from "@proemial/adapters/slack/helpers/status-messages";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { Tool } from "ai";
import { z } from "zod";
import { Slack } from "../helpers/slack";
import { Qdrant } from "@proemial/adapters/qdrant/qdrant";
import { answerParams } from "@/prompts/ask/summarize-prompt";

const tool = answerParams.tools.searchChannelAttachments;

export const getSearchChannelAttachmentsTool = (
	metadata: SlackEventMetadata,
	params?: typeof answerParams.tools.searchChannelAttachments,
) =>
	({
		description: params?.description ?? tool.description,
		parameters: z.object({
			query: z
				.string()
				.describe(params?.parameters.query ?? tool.parameters.query),
		}),
		execute: async ({ query }) => {
			console.log("Tool invocation: Search Channel Attachments", query);
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

			// The score threshold for an attachment to be considered relevant to a query
			const relevantAttachments = attachments.filter(
				(attachment) =>
					attachment.score >=
					(params?.parameters.scoreThreshold ?? tool.parameters.scoreThreshold),
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
