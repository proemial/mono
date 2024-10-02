import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Time } from "@proemial/utils/time";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

type Callback = (count: number, elapsed: number) => Promise<void>;

export async function generateEmbeddings(
	papers: OpenAlexPaper[],
	callback: Callback,
) {
	if (!papers.length) {
		return [];
	}

	const begin = Time.now();
	try {
		const embeddings = await Promise.all(
			papers.map(async (paper) => {
				return await generateEmbedding(
					`${paper.data.title} ${paper.data.abstract}`,
				);
			}),
		);
		console.log("Embeddings", embeddings.length);
		await callback(embeddings.length, Time.elapsed(begin));

		return embeddings;
	} finally {
		Time.log(begin, `generateEmbeddings(${papers.length})`);
	}
}

export async function generateEmbedding(text: string) {
	return (
		await openai.embeddings.create({
			input: text,
			model: "text-embedding-3-small",
			dimensions: 512, // default: 1536
		})
	).data.flatMap((d) => d.embedding);
}
