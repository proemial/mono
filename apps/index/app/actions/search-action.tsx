"use server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { OpenAlexPaperWithAbstract } from "@proemial/repositories/oa/models/oa-paper";
import { oaTopicsTranslationMap } from "@proemial/repositories/oa/taxonomy/oa-topics-compact";
import { VectorSpace, vectorSpaces } from "@/data/db/vector-spaces";
import { generateEmbedding } from "@/data/db/embeddings";
import { cookies } from "next/headers";
import { Time } from "@proemial/utils/time";

export type SearchResult = {
	papers?: QdrantPaper[] | undefined | null;
	metrics?: SearchMetrics;
};

export type SearchMetrics = {
	embeddings?: number;
	search?: number;
};

export type QdrantPaper = {
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
	_: SearchResult | undefined | null,
	formData: FormData,
) => {
	"use server";
	const query = formData.get("query") as string;
	const from = formData.get("from") as string;
	const count = formData.get("count") as string;
	const index = formData.get("index") as string;
	const negatedQuery = formData.get("negatedQuery") as string;
	const fullVectorSearch = formData.get("fullVectorSearch") === "true";
	const extended = formData.get("extended") === "true";

	writeCookie({
		query,
		from,
		count,
		index,
		negatedQuery,
	});

	if (!query?.length) {
		return {} as SearchResult;
	}

	const client = new QdrantClient({
		url: process.env.QDRANT_URL,
		apiKey: process.env.QDRANT_API_KEY,
	});

	const metrics = {
		embeddings: -1,
		search: -1,
	};

	const vectorSpace = vectorSpaces[index] as VectorSpace;
	let begin = Time.now();
	const embeddings = await generateEmbedding(
		[query, negatedQuery],
		vectorSpace,
	);
	metrics.embeddings = Time.elapsed(begin);
	const filter = createFilter(count, from, fullVectorSearch);

	if (negatedQuery) {
		console.log(
			"recommend",
			filter,
			embeddings.at(0)?.length,
			embeddings.at(1)?.length,
		);
		begin = Time.now();
		const response = await client.recommend(vectorSpace.collection, {
			...filter,
			positive: [embeddings.at(0) as number[]],
			negative: [embeddings.at(1) as number[]],
		});
		metrics.search = Time.elapsed(begin);

		return {
			papers: response.map((p) =>
				mapToResult(p.score, p.payload as OpenAlexPaperWithAbstract, extended),
			),
			metrics,
		} as SearchResult;
	}

	console.log("search", vectorSpace.collection, filter, embeddings[0]?.length);
	begin = Time.now();
	const response = await client.search(vectorSpace.collection, {
		...filter,
		vector: embeddings.at(0) as number[],
	});
	metrics.search = Time.elapsed(begin);

	return {
		papers: response.map((p) =>
			mapToResult(p.score, p.payload as OpenAlexPaperWithAbstract, extended),
		),
		metrics,
	} as SearchResult;
};

function writeCookie(formData: Record<string, string>) {
	const cookieStore = cookies();
	cookieStore.set("search-input", JSON.stringify(formData), {
		maxAge: 60 * 60 * 24 * 365, // 1 year
		path: "/",
	});
}

function mapToResult(
	score: number,
	payload: OpenAlexPaperWithAbstract,
	extended?: boolean,
): QdrantPaper {
	const extra = extended
		? {
				authorships: payload.authorships.map((a) => ({
					author: {
						id: a.author.id,
						display_name: a.author?.display_name,
					},
				})),
				primary_location: {
					source: {
						display_name: payload.primary_location?.source?.display_name,
						host_organization_name:
							payload.primary_location?.source?.host_organization_name,
					},
					landing_page_url: payload.primary_location?.landing_page_url,
				},
				published: payload.publication_date,
			}
		: {};

	return {
		score: score,
		id: payload.id,
		title: payload.title,
		created: payload.created_date,
		abstract: payload.abstract as string,
		features: features(payload),
		...extra,
	};
}

function createFilter(count: string, from: string, fullVectorSearch: boolean) {
	const params = fullVectorSearch
		? {
				params: {
					quantization: {
						ignore: true,
					},
				},
			}
		: {};

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
		...params,
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
