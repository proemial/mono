"use server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "@/inngest/helpers/embeddings";

export type SearchResult = {
	score: number;
	title: string;
	created: string;
	abstract: string;
	id: string;
};

export const searchAction = async (
	_: SearchResult[] | undefined | null,
	formData: FormData,
) => {
	"use server";
	const query = formData.get("query") as string;
	const from = formData.get("from") as string;
	const count = formData.get("count") as string;

	if (!query?.length) {
		return [];
	}

	const client = new QdrantClient({
		url: process.env.QDRANT_URL,
		apiKey: process.env.QDRANT_API_KEY,
	});

	const embedding = await generateEmbedding(query);
	const filter = {
		limit: Number.parseInt(count),
		filter: {
			must: {
				key: "created_date",
				range: {
					gte: from,
				},
			},
		},
	};

	const response = await client.search("gamma", {
		...filter,
		vector: embedding,
	});

	return response.map(
		(p) =>
			({
				score: p.score,
				id: p.payload?.id as string,
				title: p.payload?.title as string,
				created: p.payload?.created_date as string,
				abstract: p.payload?.abstract as string,
			}) as SearchResult,
	);
};
