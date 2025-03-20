import { answer } from "@proemial/adapters/slack/block-kit/answer-blocks";
import { link } from "@proemial/adapters/slack/block-kit/link-blocks";
import { welcomeAll } from "@proemial/adapters/slack/block-kit/welcome-all";
import { welcomeUser } from "@proemial/adapters/slack/block-kit/welcome-user";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import {
	asMrkdwn,
	SlackMessenger,
} from "@proemial/adapters/slack/slack-messenger";
import { EnvVars } from "@proemial/utils/env-vars";
import { getChannelInfo } from "@proemial/adapters/slack/helpers/channel";
import { getRandomStarters } from "../../../prompts/ask/suggestions";
import { fetchPapers } from "../ask/1-summarize.task";
import { getChannelSummary } from "@/app/api/helpers/[teamid]/channel-summary/[channelId]/channel-summary";

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
			return await SlackMessenger.sendMessageResponse(
				metadata,
				link(summary, title, questions),
			);
		}
		return await SlackMessenger.updateMessage(
			metadata,
			link(summary, title, questions),
		);
	},

	postQuestion: async (metadata: SlackEventMetadata, answer: string) => {
		return await SlackMessenger.sendMessageAsUser(metadata, answer);
	},

	postAnswer: async (metadata: SlackEventMetadata, text: string) => {
		if (metadata.isAssistant) {
			return await SlackMessenger.sendMessageResponse(
				metadata,
				answer(asMrkdwn(text)),
			);
		}
		return await SlackMessenger.updateMessage(metadata, answer(asMrkdwn(text)));
	},

	showSuggestions: async (metadata: SlackEventMetadata, title: string) => {
		return await SlackMessenger.showAssistantSuggestions(
			metadata,
			getRandomStarters(),
			title,
		);
	},

	canPostAsUser: async (metadata: SlackEventMetadata) => {
		return await SlackMessenger.canPostAsUser(metadata);
	},

	showWelcome: async (metadata: SlackEventMetadata, inviter?: string) => {
		const channelInfo = await getChannelInfo(metadata);
		const channelName = channelInfo?.name;
		await SlackMessenger.sendMessage(
			metadata,
			welcomeAll(channelName ?? metadata.channelId),
		);

		const channelSummary = await getChannelSummary(metadata);
		type tuple = [string, string];
		const links = (await fetchPapers(channelSummary.summary))
			.slice(0, 2)
			.map((paper) => paper.primary_location.landing_page_url) as tuple;

		const questions = channelSummary.questions.slice(0, 2) as tuple;

		await SlackMessenger.sendEphemeralMessage(
			metadata,
			welcomeUser(links, questions),
			inviter,
		);
	},
};
