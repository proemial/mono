import { Time } from "@proemial/utils/time";
import { LogLevel, WebClient } from "@slack/web-api";
import slackifyMarkdown from "slackify-markdown";
import { SlackDb } from "../mongodb/slack/slack.adapter";
import { answer } from "./block-kit/answer-blocks";
import { assistantStatus } from "./block-kit/assistant-status";
import { link } from "./block-kit/link-blocks";
import { status as statusBlocks } from "./block-kit/status-blocks";
import { SlackResponse } from "./models/event-models";
import { SlackEventMetadata } from "./models/metadata-models";
import { debug } from "./block-kit/debug-blocks";

// Internal logging in the slack client library
const SLACK_LIB_LOGGING = false;

// Logging of input and output to the slack client library
const REQUEST_LOGGING = false;

export const SlackMessenger = {
	updateStatus: async (
		metadata: SlackEventMetadata,
		status: string,
		isError?: boolean,
	) => {
		const begin = Time.now();

		try {
			const client = await slackClient(metadata);

			const payload = {
				channel: metadata.channelId,
				ts: (metadata.replyTs ?? metadata.ts) as string,
				...statusBlocks(metadata.target, status, isError),
			};

			const response = await client.asProem.chat.update(payload);
			logRequest("chat.update", [payload, response]);

			await logEvent("status", { metadata, response }, Time.elapsed(begin));

			return response;
		} finally {
			Time.log(begin, "[messenger][status]");
		}
	},

	postStatus: async (
		metadata: SlackEventMetadata,
		status: string,
		isError?: boolean,
		showInChannel?: boolean,
	) => {
		const begin = Time.now();

		try {
			const client = await slackClient(metadata);

			const payload = {
				channel: metadata.channelId,
				thread_ts: (metadata.replyTs ?? metadata.ts) as string,
				...statusBlocks(metadata.target, status, isError),
				reply_broadcast: !!showInChannel,
			};

			const response = await client.asProem.chat.postMessage(payload);
			logRequest("chat.postMessage", [payload, response]);

			await logEvent("status", { metadata, response }, Time.elapsed(begin));

			return response;
		} finally {
			Time.log(begin, "[messenger][status]");
		}
	},

	postDebug: async (metadata: SlackEventMetadata, message: string) => {
		const begin = Time.now();

		try {
			const client = await slackClient(metadata);

			const payload = {
				channel: metadata.channelId,
				thread_ts: (metadata.replyTs ?? metadata.ts) as string,
				...debug(message),
			};

			const response = await client.asProem.chat.postMessage(payload);
			logRequest("chat.postMessage", [payload, response]);

			await logEvent("status", { metadata, response }, Time.elapsed(begin));

			return response;
		} finally {
			Time.log(begin, "[messenger][status]");
		}
	},

	updateMessage: async (
		metadata: SlackEventMetadata,
		text: string,
		title?: string,
		questions?: Array<{ question: string; answer: string }>,
	) => {
		const begin = Time.now();

		try {
			const client = await slackClient(metadata);

			const body = questions
				? link(text, title, questions)
				: answer(slackifyMarkdown(text));

			const payload = {
				channel: metadata.channelId,
				ts: (metadata.replyTs ?? metadata.ts) as string,
				unfurl_media: false,
				...body,
			};

			const response = await client.asProem.chat.update(payload);
			logRequest("chat.update", [payload, response]);

			await logEvent("update", { metadata, response }, Time.elapsed(begin));

			return response;
		} finally {
			Time.log(begin, "[messenger][update]");
		}
	},

	sendMessage: async (
		metadata: SlackEventMetadata,
		text: string,
		title?: string,
		questions?: Array<{ question: string; answer: string }>,
	) => {
		const begin = Time.now();

		try {
			const client = await slackClient(metadata);

			const body = questions
				? link(text, title, questions)
				: answer(slackifyMarkdown(text));

			const payload = {
				channel: metadata.channelId,
				thread_ts: metadata.ts as string,
				unfurl_links: false,
				...body,
			};

			const response = await client.asProem.chat.postMessage(payload);
			logRequest("chat.postMessage", [payload, response]);

			await logEvent("send", { metadata, response }, Time.elapsed(begin));

			return response;
		} finally {
			Time.log(begin, "[messenger][send]");
		}
	},

	sendMessageAsUser: async (metadata: SlackEventMetadata, text: string) => {
		const begin = Time.now();

		try {
			const client = await slackClient(metadata);

			const asUser = async () => {
				const canPostAsUser = await SlackMessenger.canPostAsUser(metadata);
				if (!canPostAsUser) {
					return {};
				}

				const userResult = await client.asProem.users.info({
					user: metadata.user,
				});

				const asUserInfo = {
					username: userResult.user?.profile?.display_name?.length
						? userResult.user?.profile?.display_name
						: userResult.user?.name,
					icon_url: userResult.user?.profile?.image_192,
				};
				console.log(
					"users.info",
					JSON.stringify([text, metadata.user, userResult, asUserInfo]),
				);

				return asUserInfo;
			};

			const payload = {
				channel: metadata.channelId,
				thread_ts: metadata.ts as string,
				unfurl_links: false,
				text,
				...(await asUser()),
			};

			const response = await client.asProem.chat.postMessage(payload);
			logRequest("chat.postMessage", [payload, response]);

			await logEvent("sendAsUser", { metadata, response }, Time.elapsed(begin));

			return response;
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
			const payload = {
				channel: metadata.channelId,
				ts: metadata.ts as string,
				text: userMessage?.text,
				blocks: userMessage?.blocks,
				attachments: [],
			};

			const response = await client.asProem.chat.update(payload);
			logRequest("chat.update", [payload, response]);

			await logEvent("clean", { metadata, response }, Time.elapsed(begin));

			return response;
		} finally {
			Time.log(begin, "[messenger][clean]");
		}
	},

	updateAssistantStatus: async (
		metadata: SlackEventMetadata,
		status: string,
	) => {
		const begin = Time.now();

		try {
			const client = await slackClient(metadata);

			const payload = {
				thread_ts: metadata.threadTs as string,
				channel_id: metadata.channelId,
				...assistantStatus(status),
			};

			const response =
				await client.asProem.assistant.threads.setStatus(payload);
			logRequest("assistant.threads.setStatus", [payload, response]);

			await logEvent("status", { metadata, response }, Time.elapsed(begin));

			return {
				...response,
				ts: undefined,
			};
		} finally {
			Time.log(begin, "[messenger][status]");
		}
	},

	showAssistantSuggestions: async (
		metadata: SlackEventMetadata,
		suggestions: string[],
		title?: string,
	) => {
		const begin = Time.now();

		try {
			const client = await slackClient(metadata);

			const payload = {
				channel_id: metadata.channelId,
				thread_ts: metadata.threadTs as string,
				title,
				prompts: suggestions.map((suggestion) => ({
					title: suggestion,
					message: suggestion,
				})),
			};

			const response =
				// @ts-ignore
				await client.asProem.assistant.threads.setSuggestedPrompts(payload);
			logRequest("assistant.threads.setSuggestedPrompts", [payload, response]);

			await logEvent(
				"suggestions",
				{ metadata, response },
				Time.elapsed(begin),
			);

			return response;
		} finally {
			Time.log(begin, "[messenger][suggestions]");
		}
	},

	getBotInfo: async (metadata: SlackEventMetadata) => {
		const begin = Time.now();

		try {
			const client = await slackClient(metadata);

			const response = await client.asProem.auth.test();

			logRequest("auth.test", [{}, response]);
			await logEvent("botinfo", { metadata, response }, Time.elapsed(begin));

			return response;
			// return response.response_metadata?.scopes?.includes(permission);
		} finally {
			Time.log(begin, "[messenger][send]");
		}
	},

	canPostAsUser: async (metadata: SlackEventMetadata) => {
		const botInfo = await SlackMessenger.getBotInfo(metadata);
		return botInfo.response_metadata?.scopes?.includes("chat:write.customize");
	},
};

async function slackClient(metadata: SlackEventMetadata) {
	const tokens = await SlackDb.installs.getTokensForUserAndTeam(
		metadata.teamId,
		metadata.appId,
		metadata.user,
	);
	const logLevel =
		process.env.NODE_ENV === "production"
			? undefined
			: SLACK_LIB_LOGGING
				? LogLevel.DEBUG
				: undefined;

	return {
		// asUser: new WebClient(tokens.userToken, {
		// 	logLevel,
		// }),
		asProem: new WebClient(tokens.teamToken, {
			logLevel,
		}),
		tokens,
	};
}

function logRequest(action: string, payload: any) {
	if (!REQUEST_LOGGING) {
		return;
	}
	console.log("logRequest", JSON.stringify({ action, payload }));
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
