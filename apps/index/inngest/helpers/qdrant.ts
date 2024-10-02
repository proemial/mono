import { Time } from "@proemial/utils/time";
import { QdrantClient } from "@qdrant/js-client-rest";
import { v5 as uuid } from "uuid";
import { IndexedPaper } from "./paper.model";

export const collection = "o3s512alpha";

const namespace = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

type Callback = (count: number, elapsed: number) => Promise<void>;

export async function upsertPapers(
	papers: IndexedPaper[],
	embeddings: number[][],
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

		const result = await client.upsert(collection, {
			points: papers.map((paper, i) => ({
				id: uuid(paper.data.id, namespace),
				vector: embeddings[i] as number[],
				payload: paper.data,
			})),
		});
		console.log("Upserted:", result);
		await callback(papers.length, Time.elapsed(begin));

		return result;
	} finally {
		Time.log(begin, `upsertPapers(${papers.length})`);
	}
}
