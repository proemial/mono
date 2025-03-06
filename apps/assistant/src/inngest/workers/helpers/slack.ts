import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { SlackMessenger } from "@proemial/adapters/slack/slack-messenger";

export const Slack = {
	updateStatus: async (
		metadata: SlackEventMetadata,
		status: string,
		isError?: boolean,
		begin?: boolean,
	) => {
		if (metadata.isAssistant) {
			return await SlackMessenger.updateAssistantStatus(metadata, status);
		}

		if (begin) {
			const showInChannel =
				metadata.target === "annotate" && !metadata.threadTs && !isError;

			return await SlackMessenger.postStatus(
				metadata,
				status,
				isError,
				showInChannel,
			);
		}
		return await SlackMessenger.updateStatus(metadata, status, isError);
	},

	postSummary: async (
		metadata: SlackEventMetadata,
		summary: string,
		url: string,
		title: string,
	) => {
		if (metadata.isAssistant) {
			return await SlackMessenger.sendMessage(metadata, summary, url, title);
		}
		return await SlackMessenger.updateMessage(metadata, summary, url, title);
	},

	postAnswer: async (metadata: SlackEventMetadata, answer: string) => {
		if (metadata.isAssistant) {
			return await SlackMessenger.sendMessage(metadata, answer);
		}
		return await SlackMessenger.updateMessage(metadata, answer);
	},

	showSuggestions: async (
		metadata: SlackEventMetadata,
		suggestions: string[],
		title: string,
	) => {
		return await SlackMessenger.showAssistantSuggestions(
			metadata,
			suggestions,
			title,
		);
	},
};
