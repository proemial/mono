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
				features: features(p.payload as OpenAlexPaperWithAbstract),
			}) as SearchResult,
	);
};

function features(payload: OpenAlexPaperWithAbstract) {
	const topics =
		payload.topics?.map((t) => ({
			id: t.id,
			label: oaTopicsTranslationMap[t.id]?.["short-name"] ?? t.display_name,
			type: "topic",
			score: t.score,
		})) ?? [];
	const keywords =
		payload.keywords?.map((t) => ({
			id: t.id,
			label: t.display_name,
			type: "keyword",
			score: t.score,
		})) ?? [];
	const concepts =
		payload.concepts?.map((t) => ({
			id: t.id,
			label: t.display_name,
			type: "concept",
			score: t.score,
		})) ?? [];

	return [...topics, ...keywords, ...concepts].sort(
		(a, b) => b.score - a.score,
	);
}
