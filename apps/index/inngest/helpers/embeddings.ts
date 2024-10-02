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
		const response = await openai.embeddings.create({
			input: papers.map((p) => `${p.data.title} ${p.data.abstract}`),
			model: "text-embedding-3-small",
			dimensions: 512, // default: 1536
		});

		const embeddings = response.data.map((d) => d.embedding);

		console.log("Embeddings", embeddings.length);
		await callback(embeddings.length, Time.elapsed(begin));

		return embeddings;
	} finally {
		Time.log(begin, `generateEmbeddings(${papers.length})`);
	}
}
