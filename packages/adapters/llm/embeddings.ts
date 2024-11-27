import { QdrantPaper } from "../qdrant/papers";
import { Time } from "@proemial/utils/time";
import OpenAI from "openai";
import { defaultVectorSpace, VectorSpace } from "../qdrant/vector-spaces";

type Callback = (count: number, elapsed: number) => Promise<void>;

export async function generateEmbeddings(
	provider: OpenAI.Embeddings,
	papers: QdrantPaper[],
	callback: Callback,
	vectorSpace = defaultVectorSpace,
): Promise<number[][]> {
	switch (vectorSpace.model) {
		case "text-embedding-3-small":
			return generateOpenAIEmbeddings(provider, papers, vectorSpace, callback);
		default:
			throw new Error(`Unsupported model: ${vectorSpace.model}`);
	}
}

export async function generateEmbedding(
	provider: OpenAI.Embeddings,
	text: string[],
	vectorSpace = defaultVectorSpace,
): Promise<number[][]> {
	switch (vectorSpace.model) {
		case "text-embedding-3-small":
			return generateOpenAiEmbedding(provider, text, vectorSpace);
		default:
			throw new Error(`Unsupported model: ${vectorSpace.model}`);
	}
}

async function generateOpenAIEmbeddings(
	provider: OpenAI.Embeddings,
	papers: QdrantPaper[],
	vectorSpace: VectorSpace,
	callback: Callback,
): Promise<number[][]> {
	if (!papers.length) {
		return [];
	}

	const begin = Time.now();
	try {
		const response = await provider.create({
			model: vectorSpace.model,
			dimensions: vectorSpace.dimensions,
			input: papers.map((p) => `${p.payload.title} ${p.payload.abstract}`),
		});

		const embedded = response.data.map((d) => d.embedding);
		await callback(embedded.length, Time.elapsed(begin));

		return embedded;
	} finally {
		Time.log(begin, `generateOpenAIEmbeddings(${papers.length})`);
	}
}

async function generateOpenAiEmbedding(
	provider: OpenAI.Embeddings,
	text: string[],
	vectorSpace: VectorSpace,
): Promise<number[][]> {
	const begin = Time.now();
	try {
		return (
			await provider.create({
				model: vectorSpace.model,
				dimensions: vectorSpace.dimensions,
				input: text.filter((t) => t?.length),
			})
		).data.map((d) => d.embedding);
	} finally {
		Time.log(begin, `generateOpenAiEmbedding(${text?.length})`);
	}
}
