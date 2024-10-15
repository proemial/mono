import { OpenAlexPaperWithAbstract } from "@proemial/repositories/oa/models/oa-paper";
import { oaTopicsTranslationMap } from "@proemial/repositories/oa/taxonomy/oa-topics-compact";
import { Time } from "@proemial/utils/time";
import { generateEmbedding } from "./embeddings";
import {
	VectorSpace,
	VectorSpaceName,
	vectorSpace as getVectorSpace,
} from "../vector-spaces";
import { qdrant } from "../papers";
import dayjs from "dayjs";

export async function qdrantPapersSearch(
	name: VectorSpaceName,
	queries: string[] | number[][],
	period?: string,
	quantization?: "binary" | undefined,
	limit = 10,
	// offset?: string,
): Promise<SearchResult> {
	if (queries.length === 0) {
		return {};
	}

	const vectorSpace = getVectorSpace(name) as VectorSpace;

	const metrics = {
		embeddings: -1,
		search: -1,
	};

	let begin = Time.now();
	const embeddings =
		Array.isArray(queries) && typeof queries[0] === "string"
			? await generateEmbedding(queries as string[], vectorSpace)
			: (queries as number[][]);
	metrics.embeddings = Time.elapsed(begin);

	console.log("search", vectorSpace.collection, embeddings[0]?.length);
	begin = Time.now();
	const response = await search(
		vectorSpace.collection,
		embeddings,
		limit,
		period,
		quantization,
		// offset,
	);
	metrics.search = Time.elapsed(begin);

	return {
		papers: response.map((p) =>
			asSearchHit(p.score, p.payload as OpenAlexPaperWithAbstract),
		),
		metrics,
	} as SearchResult;
}

async function search(
	collection: string,
	embeddings: number[][],
	limit: number,
	period?: string,
	quantization?: "binary",
	// offset?: string,
) {
	const filter = createFilter(limit, period ?? "", quantization);

	switch (embeddings.length) {
		case 1:
			return await qdrant.search(collection, {
				...filter,
				vector: embeddings.at(0) as number[],
				with_payload: true,
				// offset,
			});
		case 2:
			return await qdrant.recommend(collection, {
				...filter,
				positive: [embeddings.at(0) as number[]],
				negative: [embeddings.at(1) as number[]],
				with_payload: true,
				// offset,
			});
		default:
			return [];
	}
}

function createFilter(limit: number, from: string, quantization?: string) {
	const gte = /^\d{4}-\d{2}-\d{2}$/.test(from)
		? from
		: /^\d+d$/.test(from)
			? dayjs()
					.subtract(Number.parseInt(from.slice(0, -1)), "day")
					.format("YYYY-MM-DD")
			: dayjs(from).subtract(5, "day").format("YYYY-MM-DD");

	const params =
		quantization === "binary"
			? {
					params: {
						quantization: {
							ignore: true,
						},
					},
				}
			: {};

	return {
		filter: {
			must: {
				key: "created_date",
				range: {
					gte,
				},
			},
		},
		limit,
		...params,
	};
}

export type SearchResult = {
	papers?: QdrantSearchHit[] | undefined | null;
	metrics?: SearchMetrics;
};

export type SearchMetrics = {
	embeddings?: number;
	search?: number;
};

export type QdrantSearchHit = {
	score: number;
	paper: OpenAlexPaperWithAbstract;
};

export type SearchHitFeature = {
	id: string;
	label: string;
	score: number;
	type: "topic" | "keyword" | "concept";
};

function asSearchHit(
	score: number,
	payload: OpenAlexPaperWithAbstract,
): QdrantSearchHit {
	return {
		score: score,
		paper: payload,
	};
}

function asFeatures(payload: OpenAlexPaperWithAbstract): SearchHitFeature[] {
	const topics =
		payload.topics?.map(
			(t) =>
				({
					id: t.id,
					label: oaTopicsTranslationMap[t.id]?.["short-name"] ?? t.display_name,
					type: "topic",
					score: t.score,
				}) as SearchHitFeature,
		) ?? [];
	const keywords =
		payload.keywords?.map(
			(t) =>
				({
					id: t.id,
					label: t.display_name,
					type: "keyword",
					score: t.score,
				}) as SearchHitFeature,
		) ?? [];
	const concepts =
		payload.concepts?.map(
			(t) =>
				({
					id: t.id,
					label: t.display_name,
					type: "concept",
					score: t.score,
				}) as SearchHitFeature,
		) ?? [];

	return [...topics, ...keywords, ...concepts].sort(
		(a, b) => b.score - a.score,
	);
}
