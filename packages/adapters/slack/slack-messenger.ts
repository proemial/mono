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
import { Time } from "@proemial/utils/time";

export const SlackMessenger = {
	nudgeUser: async (metadata: SlackEventMetadata) => {
		const begin = Time.now();
		try {
			await nudgeUser(metadata);
		} finally {
			Time.log(begin, "[messenger][nudge]");
		}
	},

	updateMessage: async (
		metadata: SlackEventMetadata,
		text: string,
		url?: string,
		title?: string,
	) => {
		const begin = Time.now();

		try {
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
					console.error("User message not found, aborting.");
					return;
				}
				payload = await updateMessage(
					target,
					userMessage.text,
					text,
					url,
					title,
				);
			}
		} finally {
			Time.log(begin, "[messenger][update]");
		}
	},

	sendMessage: async (
		metadata: SlackEventMetadata,
		text: string,
		url?: string,
		title?: string,
	) => {
		const begin = Time.now();

		try {
			const target = await getTarget(metadata);
			if (!target) {
				return;
			}

			const userMessage = await SlackDb.eventLog.getUserMessage(metadata);
			if (!userMessage) {
				console.error("User message not found, aborting.");
				return;
			}

			await SlackMessenger.cleanMessage(metadata);
			return await sendMessage(target, userMessage.text, text, url, title);
		} finally {
			Time.log(begin, "[messenger][send]");
		}
	},

	cleanMessage: async (metadata: SlackEventMetadata) => {
		const begin = Time.now();

		try {
			const target = await getTarget(metadata);
			if (!target?.accessTokens.userToken) {
				console.log("User token not found, aborting.");
				return;
			}

			const userMessage = await SlackDb.eventLog.getUserMessage(metadata);
			if (!userMessage) {
				console.error("User message not found, aborting.");
				return;
			}
			return await cleanMessage(target, userMessage.text, userMessage.blocks);
		} finally {
			Time.log(begin, "[messenger][clean]");
		}
	},

	updateStatus: async (
		metadata: SlackEventMetadata,
		status: string,
		isError?: boolean,
	) => {
		const begin = Time.now();

		try {
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
					console.error("User message not found, aborting.");
					return;
				}
				payload = await updateStatus(target, status, userMessage.text, isError);
			}
		} finally {
			Time.log(begin, "[messenger][status]");
		}
	},

	showSuggestions: async (
		metadata: SlackEventMetadata | undefined,
		suggestions: string[],
		title?: string,
	) => {
		const begin = Time.now();

		try {
			return await showSuggestions(metadata, suggestions, title);
		} finally {
			Time.log(begin, "[messenger][suggestions]");
		}
	},
};

async function getTarget(metadata: SlackEventMetadata) {
	const accessTokens = await SlackDb.installs.getTokensForUserAndTeam(
		metadata.teamId,
		metadata.appId,
		metadata.user,
	);
	if (!accessTokens) {
		console.log("Install not found, aborting.");
		return undefined;
	}

	const target = {
		channelId: metadata.channelId,
		ts: metadata.ts,
		threadTs: metadata.threadTs,
		accessTokens,
		target: metadata.target,
	} as SlackV2MessageTarget;

	return target;
}
