import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";
import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse";

export const revalidate = 0;

type Message = {
	ts: string;
	thread_ts?: string;
	type: string;
	text: string;
	user: string;
	reactions: {
		name: string;
		users: string[];
	}[];
	replies?: Message[];
};

export async function GET(
	request: Request,
	{ params }: { params: { teamid: string; channelId: string } },
) {
	const { teamid, channelId: channel } = params;
	const app = await SlackDb.installs.get(teamid, "A08AD1FSPHV");
	if (!app) {
		return NextResponse.json({ error: "App not found" }, { status: 404 });
	}

	const slack = new WebClient(app.metadata.accessToken);

	const channelInfo = await slack.conversations.info({
		channel,
	});
	const channelDescription = {
		created: formatTs(channelInfo.channel?.created),
		name: channelInfo.channel?.name,
		topic: channelInfo.channel?.topic?.value,
		purpose: channelInfo.channel?.purpose?.value,
	};

	const history = await slack.conversations.history({
		channel,
		limit: 100,
	});

	const userIds = new Set<string>();

	const messages = await Promise.all(
		history.messages?.map(async (m) => {
			let replies: Message[] | undefined;
			if (!m.subtype && m.thread_ts) {
				const thread = await slack.conversations.replies({
					channel,
					ts: m.thread_ts as string,
				});
				replies = thread.messages?.map((reply) => {
					return extractMessage(reply, userIds);
				});

				// Remove root element
				replies?.shift();
			}

			return {
				...extractMessage(m, userIds),
				replies,
			} as Message;
		}) ?? [],
	);

	return NextResponse.json({
		description: channelDescription,
		messages: await addUsers(
			messages
				.reverse()
				.filter(
					(m) => m.type === "message" || m.type === "message/thread_broadcast",
				),
			userIds,
			slack,
		),
	});
}

function extractMessage(message: MessageElement, userIds: Set<string>) {
	userIds.add(message.user as string);
	extractUserIds(message)?.forEach((userId) => userIds.add(userId));

	return {
		ts: formatTs(message.ts),
		thread_ts: formatTs(message.thread_ts),
		// @ts-ignore
		type: `${message.type}${message.subtype ? `/${message.subtype}` : ""}`,
		text: extractText(message),
		user: message.user,
		reactions: message.reactions?.map((r) => {
			r.users?.forEach((u) => userIds.add(u as string));
			return {
				name: r.name,
				users: r.users,
			};
		}),
	} as Message;
}

function extractUserIds(m: MessageElement) {
	return m.text?.match(/<@([A-Z0-9]+)>/g)?.map((m) => m.slice(2, -1));
}

function extractText(message: MessageElement) {
	const text = message.text
		? message.text
		: message.attachments
				?.at(0)
				?.blocks?.filter((b) => b.type === "context")
				.map((b) => b.elements?.map((e) => e.text).join(" "))
				.join("\n");

	if (!text) {
		console.log(JSON.stringify(message));
	}
	return text;
}

async function addUsers(
	messages: Message[],
	userIds: Set<string>,
	slack: WebClient,
) {
	const users = await Promise.all(
		Array.from(userIds)
			.filter((userId) => !!userId)
			.map(async (userId) => {
				const user = await slack.users.info({ user: userId });
				return user.user;
			}),
	);

	return messages.map((m) => ({
		...m,
		user:
			users.find((u) => u?.id === m.user)?.profile?.display_name ||
			users.find((u) => u?.id === m.user)?.name,

		text: m.text?.replace(/<@([A-Z0-9]+)>/g, (match, userId) => {
			const user = users.find((u) => u?.id === userId);
			return `<@${user?.profile?.display_name || user?.name || match}>`;
		}),

		replies: m.replies?.map((r) => ({
			...r,
			user:
				users.find((u) => u?.id === r.user)?.profile?.display_name ||
				users.find((u) => u?.id === r.user)?.name,
			text: r.text?.replace(/<@([A-Z0-9]+)>/g, (match, userId) => {
				const user = users.find((u) => u?.id === userId);
				return `<@${user?.profile?.display_name || user?.name || match}>`;
			}),

			reactions: r.reactions?.map((r) => ({
				...r,
				users: r.users.map(
					(u) =>
						users.find((ru) => ru?.id === u)?.profile?.display_name ||
						users.find((ru) => ru?.id === u)?.name,
				),
			})),
		})),

		reactions: m.reactions?.map((r) => ({
			...r,
			users: r.users.map(
				(u) =>
					users.find((ru) => ru?.id === u)?.profile?.display_name ||
					users.find((ru) => ru?.id === u)?.name,
			),
		})),
	}));
}

function formatTs(ts?: string): string | undefined;
function formatTs(ts?: number): string | undefined;
function formatTs(ts?: string | number): string | undefined {
	if (!ts) {
		return undefined;
	}
	const timestamp = typeof ts === "string" ? Number.parseFloat(ts) : ts;
	const date = new Date(timestamp * 1000);
	return `${date.toISOString().split("T")[0].replace(/-/g, ".")} ${date.toTimeString().split(" ")[0]}`;
}
