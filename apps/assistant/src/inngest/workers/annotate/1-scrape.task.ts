import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { ScrapedUrl } from "@proemial/adapters/mongodb/slack/scraped.types";
import {
	fetchTranscript,
	isYouTubeUrl,
	normalizeYouTubeUrl,
} from "@proemial/adapters/youtube/transcript";
import { diffbot } from "@proemial/adapters/diffbot";
import { AnnotateRouter } from "@/inngest/routing";
import { getColors } from "@proemial/adapters/googleapis/vision";
import { SlackAnnotateEvent } from "../../workers";
import { setStatus } from "@proemial/adapters/slack/status";
import { statusMessages } from "@/inngest/status-messages";

export const eventName = "annotate/scrape";
const eventId = "annotate/scrape/fn";

export const scrapeTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data } as SlackAnnotateEvent;

			if (!payload.url) {
				throw new Error("No url provided");
			}
			await setStatus(payload.metadata, statusMessages.annotate.begin);

			const normalizedUrl = isYouTubeUrl(payload.url)
				? normalizeYouTubeUrl(payload.url)
				: payload.url;

			let scrapedUrl = await SlackDb.scraped.get(normalizedUrl);
			const actions = [scrapedUrl ? "fetch-hit" : "fetch-miss"];

			if (!scrapedUrl) {
				// TODO: fallback to a different scraper when diffbot fails.
				// Example: Scraping failed: 'No objects: https://rclone.org/'
				const content = isYouTubeUrl(normalizedUrl)
					? await fetchTranscript(normalizedUrl)
					: await diffbot(normalizedUrl);

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
		},
	),
};
