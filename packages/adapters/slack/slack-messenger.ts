import { SlackV2MessageTarget } from "../mongodb/slack/v2.models";
import { SlackDb } from "../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "./models/metadata-models";
import { updateMessage } from "./ui-updates/update-message";
import { showSuggestions } from "./ui-updates/show-suggestions";
import { updateStatus } from "./ui-updates/update-status";
import { nudgeUser } from "./ui-updates/nudge-user";
import { SlackEventCallback } from "../mongodb/slack/events.types";
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
		const id = metadata?.eventId as string;
		const type = "slack/nudge";

		try {
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

			await updateEvents(id, type, payload);
		} catch (error) {
			await updateEvents(id, type, error);
			throw error;
		}
	},

	updateMessage: async (
		metadata: SlackEventMetadata,
		text: string,
		url?: string,
		title?: string,
	) => {
		const id = metadata?.eventId as string;
		const type = "slack/message";

		try {
			if (metadata.isAssistant) {
				return await SlackMessenger.sendMessage(metadata, text, url, title);
			}

			const target = await getTarget(metadata, type, text);
			if (!target) {
				return;
			}

			let payload = {};
			const userMessage = await SlackDb.events.get(
				metadata.eventId,
				"SlackEventCallback",
			);

			if (target.accessTokens.userToken) {
				payload = await updateMessage(
					target,
					(userMessage?.payload as SlackEventCallback).event.text,
					text,
					url,
					title,
				);
			} else {
				await SlackMessenger.nudgeUser(metadata, text, url, title);
			}

			await updateEvents(id, type, payload);
		} catch (error) {
			await updateEvents(id, type, error);
			throw error;
		}
	},

	sendMessage: async (
		metadata: SlackEventMetadata,
		text: string,
		url?: string,
		title?: string,
	) => {
		const id = metadata?.eventId as string;
		const type = "slack/message";

		try {
			const target = await getTarget(metadata, type, text);
			if (!target) {
				return;
			}

			const userMessage = await SlackDb.events.get(
				metadata.eventId,
				"SlackEventCallback",
			);
			const payload = await sendMessage(
				target,
				(userMessage?.payload as SlackEventCallback).event.text,
				text,
				url,
				title,
			);

			await updateEvents(id, type, payload);
		} catch (error) {
			await updateEvents(id, type, error);
			throw error;
		}
	},

	cleanMessage: async (metadata: SlackEventMetadata) => {
		const id = metadata?.eventId as string;
		const type = "slack/clean";

		try {
			const target = await getTarget(metadata, type);
			if (!target) {
				return;
			}

			const userMessage = (
				await SlackDb.events.get(metadata.eventId, "SlackEventCallback")
			)?.payload as SlackEventCallback;
			console.log("CLEAN USER MESSAGE", userMessage);
			const payload = await cleanMessage(
				target,
				userMessage.event.text,
				userMessage.event.blocks,
			);

			await updateEvents(id, type, payload);
		} catch (error) {
			await updateEvents(id, type, error);
			throw error;
		}
	},

	updateStatus: async (
		metadata: SlackEventMetadata,
		status: string,
		isError?: boolean,
	) => {
		const id = metadata?.eventId as string;
		const type = "slack/status";

		try {
			const target = await getTarget(metadata, type, status);
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
				const userMessage = await SlackDb.events.get(
					metadata.eventId,
					"SlackEventCallback",
				);
				payload = await updateStatus(
					target,
					status,
					(userMessage?.payload as SlackEventCallback).event.text,
					isError,
				);
			}

			await updateEvents(id, type, payload);
		} catch (error) {
			await updateEvents(id, type, error);
			throw error;
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

async function getTarget(
	metadata: SlackEventMetadata,
	type: string,
	text?: string,
) {
	const events = await SlackDb.v2Events.list(metadata.eventId);
	const latest = events.filter((e) => e.type === type).at(-1);
	const latestPayload = latest?.payload as
		| { text: string; threadTs: string }
		| undefined;

	if (
		type !== "slack/clean" &&
		(latest?.error || latestPayload?.text === text)
	) {
		console.log("Error or latest event already exists");
		return undefined;
	}

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
		channelId: metadata.channel.id,
		ts: metadata.ts,
		threadTs: metadata.threadTs,
		accessTokens,
	} as SlackV2MessageTarget;
	console.log("TARGET", target);

	return target;
}

async function updateEvents(
	eventId: string,
	type: string,
	body: { error?: unknown } | unknown,
) {
	const error = (body as { error?: unknown })?.error;

	const payloadOrError = error
		? { error: (error as Error).message }
		: { payload: body };

	await SlackDb.v2Events.insert({
		eventId,
		type,
		...payloadOrError,
	});
}
