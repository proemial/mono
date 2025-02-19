import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { AnnotateRouter } from "@/inngest/routing";
import { SlackAnnotateEvent } from "../../workers";
import { generateSummary } from "@/prompts/annotate/summarize-prompts";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { uuid5 } from "@proemial/utils/uuid";
import { Summaries } from "@proemial/adapters/mongodb/slack/scraped.types";
import { statusMessages } from "@/inngest/status-messages";
import { SlackMessenger } from "@proemial/adapters/slack/slack-messenger";

export const eventName = "annotate/query";
const eventId = "annotate/query/fn";

export const queryTask = {
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
			await SlackMessenger.updateStatus(
				payload.metadata,
				statusMessages.annotate.summarize,
			);

			const scraped = await SlackDb.scraped.get(payload.url);
			if (!scraped) {
				throw new Error("No scraped data found");
			}
			const summaries = scraped.summaries ?? {};

			if (!summaries.query) {
				const indexQuery = await generateSummary(
					scraped.content.text,
					scraped.content.title,
					uuid5(payload.url, "helicone"),
				);

				const parsedQuery = indexQuery
					.split("<summary>")[1]
					?.split("</summary>")[0];

				if (!parsedQuery) {
					throw new Error("[news][query] Failed to parse search query", {
						cause: {
							url: payload.url,
							indexQuery,
						},
					});
				}
				await SlackDb.scraped.upsert({
					...scraped,
					summaries: {
						...summaries,
						query: parsedQuery,
					} as Summaries,
				});
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
