import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { ScrapedUrl } from "@proemial/adapters/mongodb/slack/scraped.types";
import { fetchTranscript } from "@proemial/adapters/youtube/oxylabs";
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
import { isSlackFileUrl, fetchSlackFile } from "@proemial/adapters/slack/files";

export const eventName = "annotate/scrape";
const eventId = "annotate/scrape/fn";

const llamaParseClient = new LlamaParseClient({
	apiKey: process.env.LLAMA_CLOUD_API_KEY as string,
	verbose: true,
});

export const scrapeTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1, retries: 0 },
		{ event: eventName },
		async ({ event }) => {
			const payload = { ...event.data } as SlackAnnotateEvent;

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
							const { teamId, appId } = payload.metadata;
							const install = await SlackDb.installs.get(teamId, appId);
							if (!install) {
								throw new Error("Bot install not found");
							}
							const mimetype = payload.fileMimetype;
							if (!mimetype) {
								throw new Error("File mimetype missing");
							}
							const file = await fetchSlackFile(
								normalizedUrl,
								install.metadata.accessToken,
								mimetype,
							);
							const { markdown } = await llamaParseClient.parseFile(file);
							content = {
								title: file.name,
								text: markdown,
								images: [],
							};
						} else if (isYouTubeUrl(normalizedUrl)) {
							content = await fetchTranscript(normalizedUrl);
						} else if (isTwitterUrl(normalizedUrl)) {
							content = await scrape(normalizedUrl);
						} else {
							content = await diffbot(normalizedUrl);
						}
					} catch (error) {
						console.warn(
							`Main scraper failed to scrape ${normalizedUrl} - attempting again with fallback scraper…`,
						);
						console.error(error);
						content = await scrape(normalizedUrl);
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
					event,
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
				throw error;
			}
		},
	),
};

const isTwitterUrl = (url: string) => {
	const urlObj = new URL(url);
	return (
		urlObj.hostname.includes("twitter.com") || urlObj.hostname.includes("x.com")
	);
};
