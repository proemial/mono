"use server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "@/inngest/helpers/embeddings";
import { OpenAlexPaperWithAbstract } from "@proemial/repositories/oa/models/oa-paper";
import { oaTopicsTranslationMap } from "@proemial/repositories/oa/taxonomy/oa-topics-compact";

export type SearchResult = {
	score: number;
	title: string;
	created: string;
	abstract: string;
	id: string;
	features: Feature[];
};

export type Feature = {
	id: string;
	label: string;
	score: number;
	type: "topic" | "keyword" | "concept";
};

export const searchAction = async (
	_: SearchResult[] | undefined | null,
	formData: FormData,
) => {
	"use server";
	const query = formData.get("query") as string;
	const from = formData.get("from") as string;
	const count = formData.get("count") as string;
	const index = formData.get("index") as string;
	const negatedQuery = formData.get("negatedQuery") as string;

	if (!query?.length) {
		return [];
	}

	const client = new QdrantClient({
		url: process.env.QDRANT_URL,
		apiKey: process.env.QDRANT_API_KEY,
	});

	const dimensions = index === "o3s512alpha" ? 512 : 1536;
	const embedding = await generateEmbedding(query, dimensions);
	const filter = createFilter(count, from);

	if (negatedQuery) {
		const negatedEmbedding =
			negatedQuery && (await generateEmbedding(negatedQuery, dimensions));

		console.log("recommend", index, filter, embedding.length);
		const response = await client.recommend(index, {
			...filter,
			positive: [embedding],
			negative: [negatedEmbedding],
		});

		return response.map((p) =>
			mapToResult(p.score, p.payload as OpenAlexPaperWithAbstract),
		);
	}

	console.log("search", index, filter, embedding.length);
	const response = await client.search(index, {
		...filter,
		vector: embedding,
	});

	return response.map((p) =>
		mapToResult(p.score, p.payload as OpenAlexPaperWithAbstract),
	);
};

function mapToResult(
	score: number,
	payload: OpenAlexPaperWithAbstract,
): SearchResult {
	return {
		score: score,
		id: payload.id,
		title: payload.title,
		created: payload.created_date,
		abstract: payload.abstract as string,
		features: features(payload),
	};
}

function createFilter(count: string, from: string) {
	return {
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
}

function features(payload: OpenAlexPaperWithAbstract): Feature[] {
	const topics =
		payload.topics?.map(
			(t) =>
				({
					id: t.id,
					label: oaTopicsTranslationMap[t.id]?.["short-name"] ?? t.display_name,
					type: "topic",
					score: t.score,
				}) as Feature,
		) ?? [];
	const keywords =
		payload.keywords?.map(
			(t) =>
				({
					id: t.id,
					label: t.display_name,
					type: "keyword",
					score: t.score,
				}) as Feature,
		) ?? [];
	const concepts =
		payload.concepts?.map(
			(t) =>
				({
					id: t.id,
					label: t.display_name,
					type: "concept",
					score: t.score,
				}) as Feature,
		) ?? [];

	return [...topics, ...keywords, ...concepts].sort(
		(a, b) => b.score - a.score,
	);
}
