import { ReferencedPaper } from "@proemial/adapters/redis/news";

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
	try {
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
	} catch (e) {
		console.error("Failed to fetch papers", e);
		throw new Error("Failed to fetch papers", {
			cause: {
				error: e,
			},
		});
	}
};
