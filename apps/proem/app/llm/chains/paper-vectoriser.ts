import { Paper } from "@/app/api/paper-search/search";
import { Metrics } from "@/components/analytics/sentry/metrics";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Time } from "@proemial/utils/time";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export async function vectorisePapers(
	question: string,
	papers: Paper[],
	count = 5,
) {
	const start = Time.now();

	try {
		let begin = Time.now();
		let vectorStore: MemoryVectorStore;
		try {
			vectorStore = await MemoryVectorStore.fromTexts(
				papers.map((paper) => paper?.abstract as string),
				papers.map((paper) => paper.link),
				// TODO: Evaluate faster embeddings model
				new OpenAIEmbeddings({ modelName: "text-embedding-3-small" }),
			);
		} finally {
			Time.log(begin, `vectorStore initialized om ${papers.length} papers`);
			Metrics.elapsedSince(begin, "ask.papers.rerank.vectorize");
		}

		begin = Time.now();
		try {
			const result = await vectorStore.similaritySearch(question, count);

			return result.map((r) => {
				const paper = papers.find((p) => p.link === `${r.metadata}`);
				return {
					abstract: r.pageContent,
					link: r.metadata,
					title: paper?.title,
					publicationDate: paper?.publicationDate,
				};
			});
		} finally {
			Time.log(begin, `Similarity search performed, returning ${count} papers`);
			Metrics.elapsedSince(begin, "ask.papers.rerank.search");
		}
	} finally {
		Time.log(start, "Elapsed");
		Metrics.elapsedSince(start, "ask.papers.rerank");
	}
}
