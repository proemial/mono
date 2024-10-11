import { Time } from "@proemial/utils/time";
import { QdrantClient } from "@qdrant/js-client-rest";
import { v5 as uuid } from "uuid";
import { QdrantPaper } from "../../inngest/helpers/qdrant.model";
import { VectorSpace } from "./vector-spaces";

const namespace = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

export function qdrantId(id: string) {
	return uuid(id, namespace);
}

type Callback = (count: number, elapsed: number) => Promise<void>;

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
