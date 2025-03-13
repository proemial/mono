import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { SlackMessenger } from "@proemial/adapters/slack/slack-messenger";
import { EnvVars } from "@proemial/utils/env-vars";

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
			return await SlackMessenger.postStatus(metadata, status, isError);
		}
		return await SlackMessenger.updateStatus(metadata, status, isError);
	},

	postDebug: async (metadata: SlackEventMetadata, message: string) => {
		if (EnvVars.isInternalSlackApp(metadata.appId)) {
			return await SlackMessenger.postDebug(metadata, message);
		}
	},

	postSummary: async (
		metadata: SlackEventMetadata,
		summary: string,
		title?: string,
		questions?: Array<{ question: string; answer: string }>,
	) => {
		if (metadata.isAssistant) {
			return await SlackMessenger.sendMessage(
				metadata,
				summary,
				title,
				questions,
			);
		}
		return await SlackMessenger.updateMessage(
			metadata,
			summary,
			title,
			questions,
		);
	},

	postQuestion: async (metadata: SlackEventMetadata, answer: string) => {
		return await SlackMessenger.sendMessageAsUser(metadata, answer);
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

	canPostAsUser: async (metadata: SlackEventMetadata) => {
		return await SlackMessenger.canPostAsUser(metadata);
	},
};
