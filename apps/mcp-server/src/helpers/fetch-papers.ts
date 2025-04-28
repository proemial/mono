import { type ReferencedPaper } from "@proemial/adapters/redis/news";

type Feature = {
	id: string;
	label: string;
	score: number;
	type: "topic" | "keyword" | "concept";
};

type QdrantPaper = ReferencedPaper & {
	score: number;
	features: Feature[];
};

export const fetchPapers = async (query: string) => {
	const result = await fetch("https://index.proem.ai/api/search", {
		method: "POST",
		body: JSON.stringify({
			query: query as string,
			from: "2024-01-01",
			extended: true,
		}),
	});
	const { papers } = (await result.json()) as { papers: QdrantPaper[] };
	return papers;
};
