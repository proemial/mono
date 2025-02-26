import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { ScrapedUrl } from "@proemial/adapters/mongodb/slack/scraped.types";
import { scrape } from "@proemial/adapters/scrapfly/scraper";
import {
	isYouTubeUrl,
	normalizeYouTubeUrl,
} from "@proemial/adapters/youtube/shared";
import { diffbot } from "@proemial/adapters/diffbot";
import { AnnotateRouter } from "@/inngest/routing";
import { getColors } from "@proemial/adapters/googleapis/vision";
import { SlackAnnotateEvent } from "../../workers";
import { statusMessages } from "@/inngest/status-messages";
import { logCriticalError } from "@proemial/adapters/slack/monitoring/failure";
import { SlackMessenger } from "@proemial/adapters/slack/slack-messenger";
import { LlamaParseClient } from "@proemial/adapters/llamaindex/llama-parse-client";
import { isSlackFileUrl, parseSlackFile } from "@proemial/adapters/slack/files";
import { isTwitterUrl } from "@proemial/adapters/twitter";
import { fetchTranscript } from "@proemial/adapters/youtube/oxylabs";
import { EventContext } from "@proemial/adapters/mongodb/slack/v2.models";
import { logMetrics } from "./metrics";

export const eventName = "annotate/scrape";
const eventId = "annotate/scrape/fn";

const llamaParseClient = new LlamaParseClient({
	apiKey: process.env.LLAMA_CLOUD_API_KEY as string,
	verbose: true,
});

export const scrapeTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data } as SlackAnnotateEvent;
			const context: EventContext = {
				channelId: payload.metadata.channel.id,
				userId: payload.metadata.user,
				ts: payload.metadata.ts,
				threadTs: payload.metadata.threadTs,
			};

			try {
				const result = await taskWorker(payload);
				await logMetrics(eventName, payload, Time.elapsed(begin));

				return result;
			} catch (error) {
				await logMetrics(
					eventName,
					payload,
					Time.elapsed(begin),
					(error as Error).message,
				);
				throw error;
			}
		},
	),
};

const taskWorker = async (payload: SlackAnnotateEvent) => {
	if (!payload.url) {
		throw new Error("No url provided");
	}

	try {
		const begin = Time.now();
		await SlackMessenger.updateStatus(
			payload.metadata,
			statusMessages.annotate.begin,
		);

		const normalizedUrl = isYouTubeUrl(payload.url)
			? normalizeYouTubeUrl(payload.url)
			: payload.url;

		let scrapedUrl = await SlackDb.scraped.get(normalizedUrl);
		const actions = [scrapedUrl ? "fetch-hit" : "fetch-miss"];

		if (!scrapedUrl) {
			let content = undefined;
			try {
				if (isSlackFileUrl(normalizedUrl)) {
					if (!payload.fileMimetype) {
						throw new Error("File mimetype missing");
					}
					content = await parseSlackFile(
						normalizedUrl,
						payload.fileMimetype,
						payload.metadata,
						llamaParseClient,
					);
				} else if (isYouTubeUrl(normalizedUrl)) {
					content = await fetchTranscript(normalizedUrl);
				} else if (isTwitterUrl(normalizedUrl)) {
					content = await scrape(normalizedUrl);
				} else {
					content = await diffbot(normalizedUrl);
				}
			} catch (error) {
				if (isFallbackable(normalizedUrl)) {
					console.warn(`Main scraper failed: ${error}\nRetrying…`);
					content = await scrape(normalizedUrl);
				} else {
					throw error;
				}
			}

			scrapedUrl = {
				url: normalizedUrl,
				content,
				createdAt: new Date(),
			} as ScrapedUrl;
			actions.push("scraped");

			if (content?.images?.length) {
				scrapedUrl.content.colors = await getColors(content.images[0].url);
				actions.push("colors");
			}

			await SlackDb.scraped.upsert(scrapedUrl);
		} else {
			console.log(`URL ${normalizedUrl} already scraped - skipping`);
		}

		// Next step from router
		const next = await AnnotateRouter.next(
			eventName,
			normalizedUrl,
			payload.metadata,
		);
		return {
			event: eventName,
			body: {
				payload: { ...payload, url: normalizedUrl },
				actions,
				steps: {
					current: eventName,
					next,
				},
				elapsed: Time.elapsed(begin),
			},
		};
	} catch (error) {
		console.error(error);
		await logCriticalError(`Error scraping ${payload.url}: "${error}"`);
		await SlackMessenger.updateStatus(
			payload.metadata,
			"Oh no! An error occurred. 😭 The dev team has been notified. 🐹",
			true,
		);
		throw error;
	}
};

const isFallbackable = (url: string) => {
	// Don't retry scraping if it's a file or Twitter url (which is already tried with Scrapfly)
	return !isSlackFileUrl(url) && !isTwitterUrl(url);
};
