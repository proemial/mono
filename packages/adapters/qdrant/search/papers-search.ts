import { OpenAlexPaperWithAbstract } from "@proemial/repositories/oa/models/oa-paper";
import { Time } from "@proemial/utils/time";
import { generateEmbedding } from "../../llm/embeddings";

import {
	VectorSpace,
	VectorSpaceName,
	defaultVectorSpace,
	vectorSpace as getVectorSpace,
} from "../vector-spaces";
import { qdrant } from "../papers";
import dayjs from "dayjs";
import LlmModels from "../../llm/models";

export async function qdrantPapersSearch(
	queries: string[] | number[][],
	period?: number,
	quantization?: "binary" | undefined,
	limit = 10,
	space: VectorSpaceName = defaultVectorSpace.collection,
	// offset?: string,
): Promise<SearchResult> {
	if (queries.length === 0) {
		return {};
	}

	const vectorSpace = getVectorSpace(space) as VectorSpace;

	const metrics = {
		embeddings: -1,
		search: -1,
	};

	let begin = Time.now();
	const embeddings =
		Array.isArray(queries) && typeof queries[0] === "string"
			? await generateEmbedding(
					LlmModels.index.embeddings(),
					queries as string[],
					vectorSpace,
				)
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
	period?: number,
	quantization?: "binary",
	// offset?: string,
) {
	const filter = createFilter(limit, period, quantization);

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

function createFilter(limit: number, period?: number, quantization?: string) {
	const gte = period
		? dayjs().subtract(period, "day").format("YYYY-MM-DD")
		: undefined;

	const dateParams = gte
		? {
				filter: {
					must: {
						key: "created_date",
						range: {
							gte,
						},
					},
				},
			}
		: {};

	const quantParams =
		quantization && quantization !== "binary"
			? {
					params: {
						quantization: {
							ignore: true,
						},
					},
				}
			: {};

	return {
		limit,
		...dateParams,
		...quantParams,
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
