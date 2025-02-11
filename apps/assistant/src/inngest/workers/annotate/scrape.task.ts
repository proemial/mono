import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { ScrapedUrl } from "@proemial/adapters/mongodb/slack/scraped.types";
// import {
// 	fetchTranscript,
// 	isYoutubeUrl,
// } from "@proemial/adapters/youtube/transcript";
import { diffbot } from "@proemial/adapters/diffbot";
import { AnnotateRouter } from "@/inngest/routers";
import { getColors } from "@proemial/adapters/googleapis/vision";
import { SlackAnnotateEvent } from "../../models";

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

			let scrapedUrl = await SlackDb.scraped.get(payload.url);
			const actions = [scrapedUrl ? "fetch-hit" : "fetch-miss"];

			if (!scrapedUrl) {
				// const content = isYoutubeUrl(payload.url)
				// 	? await fetchTranscript(payload.url)
				// 	: await diffbot(payload.url);
				const content = await diffbot(payload.url);

				scrapedUrl = {
					url: payload.url,
					content,
					createdAt: new Date(),
				} as ScrapedUrl;
				actions.push("scraped");

				if (content?.images?.length) {
					scrapedUrl.content.colors = await getColors(content.images[0].url);
					actions.push("colors");
				}

				await SlackDb.scraped.upsert(scrapedUrl);
			}

			// Next step from router
			const next = await AnnotateRouter.next(
				eventName,
				payload.url,
				payload.metadata,
			);
			return {
				event,
				body: {
					payload,
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
