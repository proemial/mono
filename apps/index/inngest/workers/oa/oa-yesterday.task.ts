import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { EventPayload } from "inngest/types";
import { generateEmbeddings } from "../../../data/db/embeddings";
import { fetchFromOpenAlex, updatedSinceQuery } from "../../helpers/openalex";
import { collection, upsertPapers } from "../../../data/db/qdrant";
import dayjs from "dayjs";
import { logEvent as logMetrics } from "@/inngest/helpers/tinybird";

const eventName = "ingest/oa/yesterday";
const eventId = "ingest/oa/yesterday/fn";

export const oaSinceYesterday = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const payload = { ...event.data };

			if (!payload.date) {
				payload.date = dayjs().format("YYYY-MM-DD");
			}
			if (!payload.count) {
				payload.count = 0;
			}

			return await fetchDateWorker(payload, event);
		},
	),
};

type Payload = {
	date: string;
	count?: number;
	nextCursor?: string;
};

async function fetchDateWorker(payload: Payload, event?: EventPayload) {
	const result = {} as { [key: string]: number };

	const begin = Time.now();
	try {
		const { meta, papers } = await fetchPapers(payload);
		result.papers = papers.length;

		const embeddings = await generateEmbeddings(
			papers,
			async (count, elapsed) => {
				console.log(
					"[SinceYesterday][embedded] generated ",
					count,
					"embeddings in",
					elapsed,
					"ms",
				);
				await logEvent(payload.date, "embedded", count, elapsed);
			},
		);
		result.embeddings = embeddings.length;

		const upserted = await upsertPapers(
			papers,
			embeddings,
			async (count, elapsed) => {
				console.log(
					"[SinceYesterday][upserted] upserted ",
					count,
					"papers in",
					elapsed,
					"ms",
				);
				await logEvent(payload.date, "upserted", count, elapsed);
			},
		);
		result.upserted = upserted ? papers.length : 0;

		if (meta.next_cursor) {
			if (payload?.count && payload?.count >= meta.count) {
				throw new Error(
					`${payload.count} papers was fetched, but there should only be a total of ${meta.count}`,
				);
			}

			await inngest.send({
				name: eventName,
				data: {
					...payload,
					count: (payload.count ?? 0) + papers.length,
					nextCursor: meta.next_cursor,
				},
			});
		}
	} finally {
		Time.log(begin, eventId);
	}

	return {
		event,
		body: {
			result,
			elapsed: Time.elapsed(begin),
		},
	};
}

async function fetchPapers(payload: Payload) {
	const begin = Time.now();

	try {
		const { date: yesterday, nextCursor } = payload;
		const cursor = nextCursor ?? "*";

		const params = `${updatedSinceQuery(yesterday)}&cursor=${cursor}`;
		const response = await fetchFromOpenAlex(params);

		if (!payload.nextCursor) {
			console.log("[SinceYesterday][fetch] ingestion started");

			await logEvent(
				payload.date,
				"expected",
				response.meta.count,
				Time.elapsed(begin),
			);
		}
		const papersReturned = response.papers.length;
		const totalPapersReturned = (payload?.count ?? 0) + papersReturned;

		console.log(
			"[SinceYesterday][fetch]",
			papersReturned,
			"papers returned. Total: ",
			totalPapersReturned,
			"/",
			response.meta.count,
			"papers",
		);
		await logEvent(
			payload.date,
			"fetched",
			response.papers.length,
			Time.elapsed(begin),
		);

		return response;
	} finally {
		Time.log(begin, eventId);
	}
}

async function logEvent(
	date: string,
	name: string,
	value: number,
	elapsed: number,
) {
	await logMetrics("ingestLog", {
		collection,
		date,
		name,
		value,
		elapsed,
	});
}
