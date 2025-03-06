import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { SlackMessenger } from "@proemial/adapters/slack/slack-messenger";

export const Slack = {
	nudgeForPermissions: async (metadata: SlackEventMetadata) => {
		await SlackMessenger.nudgeUser(metadata);
	},

	updateStatus: async (
		metadata: SlackEventMetadata,
		status: string,
		isError?: boolean,
	) => {
		await SlackMessenger.updateStatus(metadata, status, isError);
	},

	postSummary: async (
		metadata: SlackEventMetadata,
		summary: string,
		url: string,
		title: string,
	) => {
		if (metadata.isAssistant) {
			await SlackMessenger.sendMessage(metadata, summary, url, title);
		}
		await SlackMessenger.updateMessage(metadata, summary, url, title);
	},

	postAnswer: async (metadata: SlackEventMetadata, answer: string) => {
		await SlackMessenger.removeAttachments(metadata);
		await SlackMessenger.sendMessage(metadata, answer);
	},

	showSuggestions: async (
		metadata: SlackEventMetadata,
		suggestions: string[],
		title: string,
	) => {
		await SlackMessenger.showSuggestions(metadata, suggestions, title);
	},
};
