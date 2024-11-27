import { Time } from "@proemial/utils/time";
import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantPaper } from "../../inngest/helpers/qdrant.model";
import { VectorSpace } from "./vector-spaces";
import { uuid5 } from "@proemial/utils/uuid";

export function qdrantId(id: string) {
	return uuid5(id, "qdrant");
}

type Callback = (count: number, elapsed: number) => Promise<void>;

export const QdrantPapers = {
	upsert: upsertPapers,
	all: getAll,
	byIds: getByIds,
};

export async function upsertPapers(
	papers: QdrantPaper[],
	embeddings: number[][],
	vectorSpace: VectorSpace,
	callback: Callback,
) {
	if (!papers.length) {
		return [];
	}
	if (papers.length !== embeddings.length) {
		throw new Error("Papers and embeddings must be the same length");
	}

	const begin = Time.now();
	try {
		const client = new QdrantClient({
			url: process.env.QDRANT_URL,
			apiKey: process.env.QDRANT_API_KEY,
		});

		const result = await client.upsert(vectorSpace.collection, {
			points: papers.map((paper, i) => ({
				id: paper.id,
				vector: embeddings[i] as number[],
				payload: paper.payload,
			})),
		});
		console.log("Upserted:", result);
		await callback(papers.length, Time.elapsed(begin));

		return result;
	} finally {
		Time.log(begin, `upsertPapers(${papers.length})`);
	}
}

async function getAll(vectorSpace: VectorSpace, offset?: string, limit = 200) {
	const client = new QdrantClient({
		url: process.env.QDRANT_URL,
		apiKey: process.env.QDRANT_API_KEY,
	});

	return client.scroll(vectorSpace.collection, {
		with_payload: false,
		offset,
		limit,
	});
}

async function getByIds(
	vectorSpace: VectorSpace,
	ids: string[],
	limit = 200,
	withPayload = true,
	offset?: string,
) {
	const client = new QdrantClient({
		url: process.env.QDRANT_URL,
		apiKey: process.env.QDRANT_API_KEY,
	});

	return client.scroll(vectorSpace.collection, {
		filter: {
			must: {
				has_id: ids,
			},
		},
		with_payload: withPayload,
		offset,
		limit,
	});
}
