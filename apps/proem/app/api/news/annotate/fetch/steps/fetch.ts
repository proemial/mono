import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { Span } from "@/components/analytics/braintrust/llm-trace";
import { wrapTraced } from "braintrust";

export type SearchResult = {
	papers: QdrantPaper[];
};

export type QdrantPaper = ReferencedPaper & {
	score: number;
	features: Feature[];
};

type Feature = {
	id: string;
	label: string;
	score: number;
	type: "topic" | "keyword" | "concept";
};

export async function fetchPapers(url: string, query: string, trace: Span) {
	try {
		const papers = await wrapTraced(async function myFunc() {
			const result = await fetch("https://index.proem.ai/api/search", {
				method: "POST",
				body: JSON.stringify({
					query: query as string,
					from: "2024-01-01",
					extended: true,
				}),
			});
			const { papers } = (await result.json()) as SearchResult;

			trace.log({
				input: query,
				output: papers,
				metadata: {
					url,
				},
			});

			return papers;
		})();
		trace.log({
			tags: ["annotate"],
			metadata: {
				url,
			},
		});

		return papers;
	} catch (e) {
		console.error("[news][fetch] failed to fetch papers", e);
		throw new Error("[news][fetch] failed to fetch papers", {
			cause: {
				url,
				error: e,
			},
		});
	}
}
