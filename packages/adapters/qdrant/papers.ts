import { OpenAlexPaperWithAbstract } from "@proemial/repositories/oa/models/oa-paper";
import { QdrantClient } from "@qdrant/js-client-rest";
import { qdrantPapersSearch } from "./search/papers-search";

export const QdrantPapers = {
	search: qdrantPapersSearch,
};

export const qdrant = new QdrantClient({
	url: process.env.QDRANT_URL,
	apiKey: process.env.QDRANT_API_KEY,
});

export type Provider = "openalex" | "arxiv";

export type QdrantPaper = {
	id: string;
	payload: QdrantPaperPayload;
};

export type QdrantPaperPayload = OpenAlexPaperWithAbstract & {
	provider: Provider;
	removed?: { [key: string]: number | undefined };
};
