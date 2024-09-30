import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { EventPayload } from "inngest/types";
import { generateEmbeddings } from "../../helpers/embeddings";
import { fetchWithAbstract } from "../../helpers/fetch";
import { upsertPapers } from "../../helpers/qdrant";
import dayjs from "dayjs";

const eventName = "ingest/oa/date";
const eventId = "ingest/oa/date/fn";

export const oaByDateStream = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const payload = { ...event.data };

			if (!payload.date) {
				payload.date = dayjs().subtract(1, "day").format("YYYY-MM-DD");
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
		console.log("worker", event, payload);

		const { meta, papers } = await fetchPapers(payload);
		result.papers = papers.length;

		const embeddings = await generateEmbeddings(papers);
		result.embeddings = embeddings.length;

		const upserted = await upsertPapers(papers, embeddings);
		result.upserted = upserted.length;

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
	const limit = 200;
	const toCreatedDate = dayjs(payload.date).add(1, "day").format("YYYY-MM-DD");
	const cursor = payload.nextCursor ?? "*";

	const filter = [
		"type:types/preprint|types/article",
		"has_abstract:true",
		`from_publication_date:${payload.date}`,
		`from_created_date:${payload.date}`,
		`to_created_date:${toCreatedDate}`,
		"language:en",
		"open_access.is_oa:true",
	]
		.filter((f) => !!f)
		.join(",");

	const params = `filter=${filter}&per_page=${limit}&cursor=${cursor}`;
	const response = await fetchWithAbstract(params);

	console.log(
		"next_cursor: ",
		response.meta.next_cursor,
		"papers: ",
		response.papers.length,
		"/",
		response.meta.count,
	);

	return response;
}
