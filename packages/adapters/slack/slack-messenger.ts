import { SlackV2MessageTarget } from "../mongodb/slack/v2.models";
import { SlackDb } from "../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "./models/metadata-models";
import { nudgeUser } from "./ui-updates/nudge-user";
import { cleanMessage } from "./ui-updates/clean-message";
import { Time } from "@proemial/utils/time";
import { SlackResponse } from "./models/event-models";
import { EnvVars } from "@proemial/utils/env-vars";
import slackifyMarkdown from "slackify-markdown";
import { WebClient, LogLevel } from "@slack/web-api";
import { status as statusBlocks } from "./block-kit/status-blocks";
import { assistantStatus } from "./block-kit/assistant-status";
import { link } from "./block-kit/link-blocks";
import { answer } from "./block-kit/answer-blocks";

const logLevel =
	process.env.NODE_ENV === "production" ? undefined : LogLevel.DEBUG;

export const SlackMessenger = {
	nudgeUser: async (metadata: SlackEventMetadata) => {
		const begin = Time.now();
		try {
			const response = await nudgeUser(metadata);
			console.log(response.ok);
			await logEvent("nudge", { metadata, response }, Time.elapsed(begin));
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

			const client = await slackClient(metadata);
			if (client.tokens.userToken) {
				const userMessage = await SlackDb.eventLog.getUserMessage(metadata);
				const response = await client.asUser.chat.update({
					channel: metadata.channelId,
					ts: metadata.ts as string,
					text: userMessage?.text,
					...link(text, url, title),
				});
				await logEvent("update", { metadata, response }, Time.elapsed(begin));
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
			const client = await slackClient(metadata);

			await SlackMessenger.cleanMessage(metadata);

			const response = await client.asProem.chat.postMessage({
				channel: metadata.channelId,
				thread_ts: metadata.ts as string,
				...answer(asMarkdown(metadata, text), url, title),
			});
			await logEvent("send", { metadata, response }, Time.elapsed(begin));
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
			const response = await cleanMessage(
				target,
				userMessage.text,
				userMessage.blocks,
			);
			await logEvent("clean", { metadata, response }, Time.elapsed(begin));
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
			const client = await slackClient(metadata);

			if (metadata.isAssistant) {
				await client.asProem.assistant.threads.setStatus({
					thread_ts: metadata.threadTs as string,
					channel_id: metadata.channelId,
					...assistantStatus(status),
				});
			} else {
				await client.asUser.chat.update({
					channel: metadata.channelId,
					ts: metadata.ts as string,
					...statusBlocks(metadata.target, status, isError),
				});
			}
		} finally {
			Time.log(begin, "[messenger][status]");
		}
	},

	showSuggestions: async (
		metadata: SlackEventMetadata,
		suggestions: string[],
		title?: string,
	) => {
		const begin = Time.now();

		try {
			const client = await slackClient(metadata);

			await client.asProem.assistant.threads.setSuggestedPrompts({
				channel_id: metadata.channelId,
				thread_ts: metadata.threadTs as string,
				title,
				// @ts-ignore
				prompts: suggestions.map((suggestion) => ({
					title: suggestion,
					message: suggestion,
				})),
			});
		} finally {
			Time.log(begin, "[messenger][suggestions]");
		}
	},
};

async function slackClient(metadata: SlackEventMetadata) {
	const tokens = await SlackDb.installs.getTokensForUserAndTeam(
		metadata.teamId,
		metadata.appId,
		metadata.user,
	);

	return {
		asUser: new WebClient(tokens.userToken, {
			logLevel,
		}),
		asProem: new WebClient(tokens.teamToken, {
			logLevel,
		}),
		tokens,
	};
}

function asMarkdown(metadata: SlackEventMetadata, text: string) {
	const internal = EnvVars.isInternalSlackApp(metadata.appId);
	return internal ? slackifyMarkdown(text) : text;
}

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

const logEvent = async (
	action: string,
	payload: { metadata: SlackEventMetadata; response: SlackResponse },
	duration: number,
) => {
	const { metadata, response } = payload;
	const error = response.error;

	await SlackDb.eventLog.upsert({
		...(error && {
			status: "failed",
		}),
		metadata: {
			appId: metadata.appId,
			teamId: metadata.teamId,
			context: {
				channelId: metadata.channelId,
				userId: metadata.user,
				ts: metadata.ts,
				threadTs: metadata.threadTs,
			},
		},
		requests: [
			{
				type: `slack:${action}`,
				input: { payload },
				...(error && {
					error,
				}),
				duration,
			},
		],
	});
};
