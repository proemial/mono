import { EnvVars } from "@proemial/utils/env-vars";
import { Time } from "@proemial/utils/time";
import { LogLevel, WebClient } from "@slack/web-api";
import slackifyMarkdown from "slackify-markdown";
import { SlackDb } from "../mongodb/slack/slack.adapter";
import { answer } from "./block-kit/answer-blocks";
import { assistantStatus } from "./block-kit/assistant-status";
import { link } from "./block-kit/link-blocks";
import { nudge } from "./block-kit/nudge-blocks";
import { status as statusBlocks } from "./block-kit/status-blocks";
import { SlackResponse } from "./models/event-models";
import { SlackEventMetadata } from "./models/metadata-models";

const logLevel =
	process.env.NODE_ENV === "production" ? undefined : LogLevel.DEBUG;

export const SlackMessenger = {
	nudgeUser: async (metadata: SlackEventMetadata) => {
		const begin = Time.now();
		try {
			const client = await slackClient(metadata);
			if (client.tokens.userToken) {
				// User has already acknowledged
				return;
			}

			const app = await SlackDb.apps.get(metadata.appId);
			const clientId = app?.metadata.clientId as string;
			const {
				teamId,
				channelId: channel,
				user,
				threadTs: thread_ts,
			} = metadata;

			const response = await client.asProem.chat.postEphemeral({
				channel,
				user,
				// threadTs is the timestamp of the message in the thread. Exclude if the message is not in a thread.
				...(thread_ts && { thread_ts }),
				...nudge(clientId, teamId),
			});

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

			const body = url
				? link(text, url, title)
				: answer(asMarkdown(metadata, text));

			const response = await client.asProem.chat.postMessage({
				channel: metadata.channelId,
				thread_ts: metadata.ts as string,
				...body,
			});
			await logEvent("send", { metadata, response }, Time.elapsed(begin));
		} finally {
			Time.log(begin, "[messenger][send]");
		}
	},

	removeAttachments: async (metadata: SlackEventMetadata) => {
		const begin = Time.now();

		if (metadata.isAssistant) {
			return;
		}

		try {
			const client = await slackClient(metadata);

			const userMessage = await SlackDb.eventLog.getUserMessage(metadata);
			const response = await client.asUser.chat.update({
				channel: metadata.channelId,
				ts: metadata.ts as string,
				text: userMessage?.text,
				blocks: userMessage?.blocks,
				attachments: [],
			});
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
