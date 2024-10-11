import { Time } from "@proemial/utils/time";
import { inngest } from "../../client";
import { EventPayload } from "inngest/types";
import { generateEmbeddings } from "../../../data/db/embeddings";
import { fetchFromOpenAlex } from "../../helpers/openalex";
import { upsertPapers } from "../../../data/db/qdrant";
import dayjs from "dayjs";
import { logEvent as logMetrics } from "@/inngest/helpers/tinybird";
import {
	defaultVectorSpaceName,
	VectorSpace,
	vectorSpaces,
} from "@/data/db/vector-spaces";

const eventName = "ingest/oa/date";
const eventId = "ingest/oa/date/fn";

export const oaByDateStream = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const payload = { ...event.data };

			if (!payload.space) {
				payload.space = defaultVectorSpaceName;
			}
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
	space: string;
};

async function fetchDateWorker(payload: Payload, event?: EventPayload) {
	const result = {} as { [key: string]: number };

	const begin = Time.now();
	try {
		const space = vectorSpaces[payload.space] as VectorSpace;

		const { meta, papers } = await fetchPapers(payload);
		result.papers = papers.length;

		const embeddings = await generateEmbeddings(
			papers,
			space,
			async (count, elapsed) => {
				await logEvent(
					space.collection,
					payload.date,
					"embedded",
					count,
					elapsed,
				);
			},
		);
		result.embeddings = embeddings.length;

		const upserted = await upsertPapers(
			papers,
			embeddings,
			space,
			async (count, elapsed) => {
				await logEvent(
					space.collection,
					payload.date,
					"upserted",
					count,
					elapsed,
				);
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
		const space = vectorSpaces[payload.space] as VectorSpace;

		const { date, nextCursor } = payload;

		const limit = 200;
		const toCreatedDate = dayjs(date).add(1, "day").format("YYYY-MM-DD");
		const cursor = nextCursor ?? "*";

		const filter = [
			"type:types/preprint|types/article",
			"has_abstract:true",
			`from_publication_date:${date}`,
			`from_created_date:${date}`,
			`to_created_date:${toCreatedDate}`,
			"language:en",
			"open_access.is_oa:true",
		]
			.filter((f) => !!f)
			.join(",");

		const params = `filter=${filter}&per_page=${limit}&cursor=${cursor}`;
		const response = await fetchFromOpenAlex(params);

		if (!payload.nextCursor) {
			await logEvent(
				space.collection,
				payload.date,
				"expected",
				response.meta.count,
				Time.elapsed(begin),
			);
		}
		await logEvent(
			space.collection,
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
	collection: string,
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
