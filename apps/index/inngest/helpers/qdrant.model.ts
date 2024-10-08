import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";

export type Provider = "openalex" | "arxiv";

export type QdrantPaper = OpenAlexPaper & {
	data: { provider: Provider; removed?: { [key: string]: number | undefined } };
};
