import { Time } from "@proemial/utils/time";
import { QdrantClient } from "@qdrant/js-client-rest";
import { IndexedPaper, Provider } from "./fetch";
import { v5 as uuid } from "uuid";

const collection = "gamma";

const namespace = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

export async function upsertPapers(
	papers: IndexedPaper[],
	embeddings: number[][],
) {
	if (!papers.length) {
		return [];
	}

	const begin = Time.now();
	try {
		const client = new QdrantClient({
			url: process.env.QDRANT_URL,
			apiKey: process.env.QDRANT_API_KEY,
		});

		const result = await client.batchUpdate(collection, {
			operations: [
				{
					upsert: {
						points: papers.map((paper, i) => ({
							id: uuid(paper.data.id, namespace),
							vector: embeddings[i] as number[],
							payload: paper.data,
						})),
					},
				},
			],
		});
		console.log("Upserted:", result);

		return result;
	} finally {
		Time.log(begin, `upsertPapers(${papers.length})`);
	}
}
