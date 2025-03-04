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
import { Metrics } from "../metrics";

export const eventName = "annotate/query";
const eventId = "annotate/query/fn";

export const queryTask = {
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
	await SlackMessenger.updateStatus(
		payload.metadata,
		statusMessages.annotate.summarize,
	);

	const scraped = await SlackDb.scraped.get(payload.url);
	if (!scraped) {
		throw new Error("No scraped data found");
	}

	if (payload.metadata.channelId === "C08F2GPLT2M") {
		console.log("proxyToN8n", payload.metadata, payload);
		return await proxyToN8n("annotate", payload.metadata, payload, {
			prompt: LlmSummary.prompt(),
			url: payload.url,
			title: scraped.content.title,
			text: scraped.content.text,
		});
	}

	const result = await summarizeAnnotationTask(payload.metadata, payload, {
		prompt: LlmSummary.prompt(),
		url: payload.url,
		title: scraped.content.title,
		text: scraped.content.text,
	});

	return result;
};

export async function summarizeAnnotationTask(
	metadata: SlackEventMetadata,
	payload: SlackAnnotateEvent,
	input: { prompt: string; url: string; title: string; text: string },
) {
	const begin = Time.now();

	const { text: indexQuery } = await generateText({
		model: await LlmSummary.model(uuid5(payload.url, "helicone"), {
			slackAppId: payload.metadata.appId,
		}),
		prompt: input.prompt
			.replace("$url", input.url)
			.replace("$title", input.title)
			.replace("$content", input.text),
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

	const scraped = await SlackDb.scraped.get(payload.url);
	if (!scraped) {
		throw new Error("No scraped data found");
	}
	const summaries = scraped.summaries ?? {};

	await SlackDb.scraped.upsert({
		...scraped,
		summaries: {
			...summaries,
			query: parsedQuery,
		} as Summaries,
	});

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
