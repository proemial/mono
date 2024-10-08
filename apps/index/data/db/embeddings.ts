import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Time } from "@proemial/utils/time";
import OpenAI from "openai";

const config = {
	dimensions: 1536, // default: 1536
	model: "text-embedding-3-small",
};

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
			...config,
			input: papers.map((p) => `${p.data.title} ${p.data.abstract}`),
		});

		const embeddings = response.data.map((d) => d.embedding);
		await callback(embeddings.length, Time.elapsed(begin));

		return embeddings;
	} finally {
		Time.log(begin, `generateEmbeddings(${papers.length})`);
	}
}

export async function generateEmbedding(text: string[], dimensions: number) {
	const begin = Time.now();
	try {
		return (
			await openai.embeddings.create({
				...config,
				dimensions,
				input: text.filter((t) => t?.length),
			})
		).data.map((d) => d.embedding);
	} finally {
		Time.log(begin, `generateEmbedding(${text?.length})`);
	}
}
