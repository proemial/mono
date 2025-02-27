import { SlackV2MessageTarget } from "../mongodb/slack/v2.models";
import { SlackDb } from "../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "./models/metadata-models";
import { updateMessage } from "./ui-updates/update-message";
import { showSuggestions } from "./ui-updates/show-suggestions";
import { updateStatus } from "./ui-updates/update-status";
import { nudgeUser } from "./ui-updates/nudge-user";
import { cleanMessage } from "./ui-updates/clean-message";
import { setAssistantStatus } from "./assistant";
import { sendMessage } from "./ui-updates/send-message";

export const SlackMessenger = {
	nudgeUser: async (
		metadata: SlackEventMetadata,
		text: string,
		url?: string,
		title?: string,
	) => {
		const appInstall = await SlackDb.installs.get(
			metadata.teamId,
			metadata.appId,
		);
		if (!appInstall) {
			throw new Error("App install not found");
		}

		const payload = await nudgeUser(
			metadata,
			appInstall.metadata.accessToken,
			text,
			url,
			title,
		);
		console.log("nudgeUser result", payload);
	},

	updateMessage: async (
		metadata: SlackEventMetadata,
		text: string,
		url?: string,
		title?: string,
	) => {
		if (metadata.isAssistant) {
			return await SlackMessenger.sendMessage(metadata, text, url, title);
		}

		const target = await getTarget(metadata);
		if (!target) {
			return;
		}

		let payload = {};
		if (target.accessTokens.userToken) {
			const userMessage = await SlackDb.eventLog.getUserMessage(metadata);
			if (!userMessage) {
				console.error("User message not found");
				return;
			}
			payload = await updateMessage(target, userMessage.text, text, url, title);
		} else {
			await SlackMessenger.nudgeUser(metadata, text, url, title);
		}
	},

	sendMessage: async (
		metadata: SlackEventMetadata,
		text: string,
		url?: string,
		title?: string,
	) => {
		const target = await getTarget(metadata);
		if (!target) {
			return;
		}

		const userMessage = await SlackDb.eventLog.getUserMessage(metadata);
		if (!userMessage) {
			console.error("User message not found");
			return;
		}
		const payload = await sendMessage(
			target,
			userMessage.text,
			text,
			url,
			title,
		);
	},

	cleanMessage: async (metadata: SlackEventMetadata) => {
		const target = await getTarget(metadata);
		if (!target) {
			return;
		}

		const userMessage = await SlackDb.eventLog.getUserMessage(metadata);
		if (!userMessage) {
			console.error("User message not found");
			return;
		}
		const payload = await cleanMessage(
			target,
			userMessage.text,
			userMessage.blocks,
		);
	},

	updateStatus: async (
		metadata: SlackEventMetadata,
		status: string,
		isError?: boolean,
	) => {
		const target = await getTarget(metadata);
		if (!target) {
			return;
		}

		let payload = {};
		if (metadata.isAssistant) {
			payload = await setAssistantStatus(
				metadata,
				target.accessTokens.teamToken,
				status,
			);
		} else {
			const userMessage = await SlackDb.eventLog.getUserMessage(metadata);
			if (!userMessage) {
				console.error("User message not found");
				return;
			}
			payload = await updateStatus(target, status, userMessage.text, isError);
		}
	},

	showSuggestions: async (
		metadata: SlackEventMetadata | undefined,
		suggestions: string[],
		title?: string,
	) => {
		return await showSuggestions(metadata, suggestions, title);
	},
};

async function getTarget(metadata: SlackEventMetadata) {
	const accessTokens = await SlackDb.installs.getTokensForUserAndTeam(
		metadata.teamId,
		metadata.appId,
		metadata.user,
	);
	if (!accessTokens) {
		console.log("Install not found");
		return undefined;
	}

	const target = {
		channelId: metadata.channelId,
		ts: metadata.ts,
		threadTs: metadata.threadTs,
		accessTokens,
	} as SlackV2MessageTarget;
	console.log("TARGET", target);

	return target;
}
