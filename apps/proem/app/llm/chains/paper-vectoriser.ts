import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Time } from "@proemial/utils/time";
import { Paper } from "@/app/api/paper-search/search";

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
				new OpenAIEmbeddings(),
			);
		} finally {
			Time.log(begin, `vectorStore initialized om ${papers.length} papers`);
		}

		begin = Time.now();
		try {
			const result = await vectorStore.similaritySearch(question, count);
			console.log("result", result);

			return result.map((r) => ({
				abstract: r.pageContent,
				link: r.metadata,
				title: papers.find((p) => p.link === `${r.metadata}`)?.title,
			}));
		} finally {
			Time.log(begin, `Similarity search performed, returning ${count} papers`);
		}
	} finally {
		Time.log(start, "Elapsed");
	}
}
