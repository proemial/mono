import { SlackV2MessageTarget } from "../mongodb/slack/v2.models";
import { SlackDb } from "../mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "./models/metadata-models";
import { sendMessage } from "./ui-updates/send-message";
import { showSuggestions } from "./ui-updates/show-suggestions";
import { updateStatus } from "./ui-updates/update-status";
import { nudgeUser } from "./ui-updates/nudge-user";
import { SlackEventCallback } from "../mongodb/slack/events.types";
import { cleanMessage } from "./ui-updates/clean-message";

export const SlackMessenger = {
	nudgeUser: async (metadata: SlackEventMetadata) => {
		const id = metadata?.eventId as string;
		const type = "slack/nudge";

		try {
			const userInstall = await SlackDb.installs.get(
				metadata.teamId,
				metadata.appId,
				metadata.user,
			);
			if (userInstall) {
				console.log("User install found, no need to nudge :)");
				return;
			}

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
			);
			console.log("nudgeUser result", payload);

			await updateEvents(id, type, payload);
		} catch (error) {
			await updateEvents(id, type, error);
			throw error;
		}
	},

	sendMessage: async (
		metadata: SlackEventMetadata,
		summary: string,
		url?: string,
		title?: string,
	) => {
		const id = metadata?.eventId as string;
		const type = "slack/message";

		try {
			const target = await getTarget(metadata, type, summary);
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
				summary,
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

	updateStatus: async (metadata: SlackEventMetadata, status: string) => {
		const id = metadata?.eventId as string;
		const type = "slack/status";

		try {
			const target = await getTarget(metadata, type, status);
			if (!target) {
				return;
			}

			const userMessage = await SlackDb.events.get(
				metadata.eventId,
				"SlackEventCallback",
			);
			const payload = await updateStatus(
				target,
				status,
				(userMessage?.payload as SlackEventCallback).event.text,
			);

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

	const install = await SlackDb.installs.get(
		metadata.teamId,
		metadata.appId,
		metadata.user,
	);
	if (!install) {
		console.log("Install not found");
		return undefined;
	}
	if (!install.metadata?.accessToken) {
		console.log("Token not found");
		return undefined;
	}

	const target = {
		channelId: metadata.channel.id,
		ts: metadata.ts,
		threadTs: metadata.threadTs,
		accessToken: install.metadata?.accessToken,
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
