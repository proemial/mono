import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { AnnotateRouter } from "@/inngest/routing";
import { SlackAnnotateEvent } from "../../workers";
import { LlmSummary } from "@/prompts/annotate/summarize-prompts";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { uuid5 } from "@proemial/utils/uuid";
import { Summaries } from "@proemial/adapters/mongodb/slack/scraped.types";
import { statusMessages } from "@/inngest/status-messages";
import { SlackMessenger } from "@proemial/adapters/slack/slack-messenger";
import { generateText, Message } from "ai";
import { proxyToN8n } from "@/app/api/events/(n8n)/n8nProxy";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";

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

			if (payload.metadata.channel.id === "C08F2GPLT2M") {
				console.log("proxyToN8n", payload.metadata, payload);
				return await proxyToN8n(
					"annotate",
					payload.metadata,
					payload,
					LlmSummary.messages(scraped.content.title, scraped.content.text),
					LlmSummary.prompt(),
				);
			}

			const result = await summarizeAnnotationTask(
				payload.metadata,
				payload,
				LlmSummary.messages(scraped.content.title, scraped.content.text),
				LlmSummary.prompt(),
			);

			await SlackDb.scraped.upsert({
				...scraped,
				summaries: {
					...summaries,
					query: result.body.answer,
				} as Summaries,
			});

			return result;
		},
	),
};

export async function summarizeAnnotationTask(
	metadata: SlackEventMetadata,
	payload: SlackAnnotateEvent,
	messages: Message[],
	prompt?: string,
) {
	const begin = Time.now();

	const { text: indexQuery } = await generateText({
		model: await LlmSummary.model(uuid5(payload.url, "helicone")),
		prompt,
		messages,
	});

	const parsedQuery = indexQuery.split("<summary>")[1]?.split("</summary>")[0];

	if (!parsedQuery) {
		throw new Error("[news][query] Failed to parse search query", {
			cause: {
				url: payload.url,
				indexQuery,
			},
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
			answer: parsedQuery,
			payload,
			steps: {
				current: eventName,
				next,
			},
			elapsed: Time.elapsed(begin),
		},
	};
}
