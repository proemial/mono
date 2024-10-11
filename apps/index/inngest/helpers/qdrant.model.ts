import { OpenAlexPaperWithAbstract } from "@proemial/repositories/oa/models/oa-paper";

export type Provider = "openalex" | "arxiv";

export type QdrantPaper = {
	id: string;
	payload: QdrantPaperPayload;
};

export type QdrantPaperPayload = OpenAlexPaperWithAbstract & {
	provider: Provider;
	removed?: { [key: string]: number | undefined };
};
