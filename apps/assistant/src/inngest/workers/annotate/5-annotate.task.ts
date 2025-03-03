import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { AnnotateRouter } from "@/inngest/routing";
import { SlackAnnotateEvent } from "../../workers";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { uuid5 } from "@proemial/utils/uuid";
import { generateFactsAndQuestions } from "@/prompts/annotate/annotate-prompts";
import { Summaries } from "@proemial/adapters/mongodb/slack/scraped.types";
import { Metrics } from "../metrics";

export const eventName = "annotate/summarize";
const eventId = "annotate/summarize/fn";

export const summarizeTask = {
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
	const begin = Time.now();

	if (!payload.url) {
		throw new Error("No url provided");
	}

	const scraped = await SlackDb.scraped.get(payload.url);
	if (!scraped?.references) {
		throw new Error("No references found");
	}

	const summaries = scraped.summaries ?? {};

	if (!summaries.background) {
		const background = await generateFactsAndQuestions(
			scraped.content.text,
			scraped.content.title,
			summaries.query?.[0] as string,
			scraped.references,
			uuid5(payload.url, "helicone"),
			{ slackTeamId: payload.metadata.teamId },
		);

		await SlackDb.scraped.upsert({
			...scraped,
			summaries: {
				...summaries,
				background: background.commentary,
				engTitle: background.engTitle,
			} as Summaries,
			questions: background.questions,
		});
	}

	// Next step from router
	const next = await AnnotateRouter.next(
		eventName,
		payload.url,
		payload.metadata,
	);
	return {
		event: eventName,
		body: {
			payload,
			steps: {
				current: eventName,
				next,
			},
			elapsed: Time.elapsed(begin),
		},
	};
};
