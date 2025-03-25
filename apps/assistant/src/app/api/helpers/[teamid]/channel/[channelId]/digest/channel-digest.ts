import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { WebClient } from "@slack/web-api";
import { extractLinks } from "@proemial/adapters/slack/helpers/links";
import { ScrapedUrl } from "@proemial/adapters/mongodb/slack/scraped.types";
import {
	isYouTubeUrl,
	normalizeYouTubeUrl,
} from "@proemial/adapters/youtube/shared";

export async function getDigest(metadata: {
	appId: string;
	teamId: string;
	channelId: string;
}) {
	const app = await SlackDb.installs.get(metadata.teamId, metadata.appId);
	if (!app) {
		throw new Error("App not found");
	}

	const slack = new WebClient(app.metadata.accessToken);

	const channelInfo = await slack.conversations.info({
		channel: metadata.channelId,
	});
	const messages = await getMessages(metadata);
	const summaries = await getSummaries(messages);

	const annotations = (await Promise.all(
		summaries.map((s) => fetchThreads(slack, metadata, s)),
	)).filter((a) => !!a);

	return {
		channel: channelInfo.channel?.name,
		context: {
			channelId: metadata.channelId,
			teamId: metadata.teamId,
			appId: metadata.appId,
		},
		count: summaries.length,
		annotations,
	};
}

async function fetchThreads(
	slack: WebClient,
	metadata: { appId: string; teamId: string; channelId: string },
	summary: Awaited<ReturnType<typeof getSummaries>>[number],
) {
	console.log(`replies({
		channel: ${metadata.channelId},
		ts: ${summary.context.ts},
		threadTs: ${summary.context.threadTs},
	})`);
	try	{
		const threadMessages = await slack.conversations.replies({
			channel: metadata.channelId,
			ts: summary.context.threadTs ?? summary.context.ts,
		});
	
		const replies =
			threadMessages.messages
				?.slice(
					threadMessages.messages.findIndex((m) => m.ts === summary.context.ts) +
						1,
				)
				?.filter((m) => !m.bot_profile) ?? [];
	
		const reactions = threadMessages.messages?.find(
			(m) => m.ts === summary.context.ts,
		)?.reactions?.map(r => ({
			name: r.name,
			count: r.count,
		}));
	
		return {
			...summary,
			replyCount: replies.length,
			reactions,
		};
	} catch (e) {
		console.error(e);
		return undefined;
	}
}

async function getMessages(metadata: {
	appId: string;
	teamId: string;
	channelId: string;
}) {
	const annotatedMessages = await SlackDb.eventLog.annotations({
		appId: metadata.appId,
		teamId: metadata.teamId,
		channelId: metadata.channelId,
	} as Omit<SlackEventMetadata, "target">);

	return annotatedMessages.map((a) => ({
		createdAt: new Date(a.createdAt),
		metadata: a.metadata,
		message: {
			message: a.eventText,
			links: (a.eventFile
				? [a.eventFile]
				: extractLinks(a.eventText)) as string[],
		},
	}));
}

// Process annotated messages to extract summaries
async function getSummaries(
	messages: Array<{
		createdAt: Date;
		metadata: {
			context: { userId: string; ts: string; threadTs: string | null };
		};
		message: { message: string; links: string[] };
	}>,
) {
	return Promise.all(
		messages.map(async (m) => {
			const { createdAt, message, metadata } = m;

			console.log("message", message);

			const scraped = await Promise.all<ScrapedUrl | null>(
				message.links.map((link) =>
					SlackDb.scraped.get(
						isYouTubeUrl(link) ? normalizeYouTubeUrl(link) : link,
					),
				),
			);

			return {
				createdAt,
				context: {
					userId: metadata.context.userId,
					ts: metadata.context.ts,
					threadTs: metadata.context.threadTs,
				},
				message: message.message,
				url: message.links.at(0),
				summary:
					scraped.at(0)?.summaries?.query ?? scraped.at(0)?.summaries?.summary,
			};
		}),
	);
}
