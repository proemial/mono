import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { AnnotateRouter } from "@/inngest/routers";
import { SlackAnnotateEvent } from "../../models";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { ReferencedPaper } from "@proemial/adapters/redis/news";

export const eventName = "annotate/fetch";
const eventId = "annotate/fetch/fn";

export const fetchTask = {
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

			const scraped = await SlackDb.scraped.get(payload.url);
			if (!scraped?.summaries?.query) {
				throw new Error("No query found");
			}

			if (!scraped.references) {
				const result = await fetch("https://index.proem.ai/api/search", {
					method: "POST",
					body: JSON.stringify({
						query: scraped.summaries.query as string,
						extended: true,
					}),
				});
				const { papers } = (await result.json()) as SearchResult;
				scraped.references = papers;

				await SlackDb.scraped.upsert(scraped);
			}

			// Next step from router
			const next = AnnotateRouter.next(
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

export type SearchResult = {
	papers: QdrantPaper[];
};

export type QdrantPaper = ReferencedPaper & {
	score: number;
	features: Feature[];
};

type Feature = {
	id: string;
	label: string;
	score: number;
	type: "topic" | "keyword" | "concept";
};
