import { AnnotateRouter } from "@/inngest/routing";
import { statusMessages } from "@/inngest/status-messages";
import { getColors } from "@proemial/adapters/googleapis/vision";
import { ScrapedUrl } from "@proemial/adapters/mongodb/slack/scraped.types";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { scrapeUrl } from "@proemial/adapters/scraping/scrape-url";
import { logCriticalError } from "@proemial/adapters/slack/monitoring/failure";
import {
	isYouTubeUrl,
	normalizeYouTubeUrl,
} from "@proemial/adapters/youtube/shared";
import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { SlackAnnotateEvent } from "../../workers";
import { Metrics } from "../metrics";
import { Slack } from "../helpers/slack";
export const eventName = "annotate/scrape";
const eventId = "annotate/scrape/fn";

export const scrapeTask = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, retries: 0 },
		{ event: eventName },
		async ({ event }) => {
			const begin = Time.now();
			const payload = { ...event.data } as SlackAnnotateEvent;

			try {
				const result = await taskWorker(payload);
				await Metrics.annotate.log(eventName, payload, Time.elapsed(begin));

				return result;
			} catch (error) {
				await Metrics.annotate.log(
					eventName,
					payload,
					Time.elapsed(begin),
					(error as Error).message,
				);
				throw error;
			} finally {
				Time.log(begin, eventName);
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

		await Slack.nudgeForPermissions(payload.metadata);

		await Slack.updateStatus(payload.metadata, statusMessages.annotate.begin);

		const normalizedUrl = isYouTubeUrl(payload.url)
			? normalizeYouTubeUrl(payload.url)
			: payload.url;

		let scrapedUrl = await SlackDb.scraped.get(normalizedUrl);
		const actions = [scrapedUrl ? "fetch-hit" : "fetch-miss"];

		if (!scrapedUrl) {
			const content = await scrapeUrl(normalizedUrl, {
				mimeType: payload.fileMimetype,
				teamId: payload.metadata.teamId,
				appId: payload.metadata.appId,
			});

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
			console.log(`Already scraped ${normalizedUrl} - skipping`);
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
		await Slack.updateStatus(
			payload.metadata,
			"Oh no! An error occurred. 😭 The dev team has been notified. 🐹",
			true,
		);
		throw error;
	}
};
