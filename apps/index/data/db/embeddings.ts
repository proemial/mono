import { QdrantPaper } from "@/inngest/helpers/qdrant.model";
import { Mistral } from "@mistralai/mistralai";
import { Time } from "@proemial/utils/time";
import OpenAI from "openai";
import { VectorSpace } from "./vector-spaces";

type Callback = (count: number, elapsed: number) => Promise<void>;

export async function generateEmbeddings(
	papers: QdrantPaper[],
	vectorSpace: VectorSpace,
	callback: Callback,
): Promise<[QdrantPaper[], number[][]]> {
	switch (vectorSpace.model) {
		case "text-embedding-3-small":
			return generateOpenAIEmbeddings(papers, vectorSpace, callback);
		case "mistral-embed":
			return generateMistralEmbeddings(papers, vectorSpace, callback);
		default:
			throw new Error(`Unsupported model: ${vectorSpace.model}`);
	}
}

export async function generateEmbedding(
	text: string[],
	vectorSpace: VectorSpace,
): Promise<number[][]> {
	switch (vectorSpace.model) {
		case "text-embedding-3-small":
			return generateOpenAiEmbedding(text, vectorSpace);
		case "mistral-embed":
			return generateMistralEmbedding(text, vectorSpace);
		default:
			throw new Error(`Unsupported model: ${vectorSpace.model}`);
	}
}

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function generateOpenAIEmbeddings(
	papers: QdrantPaper[],
	vectorSpace: VectorSpace,
	callback: Callback,
): Promise<[QdrantPaper[], number[][]]> {
	if (!papers.length) {
		return [papers, []];
	}

	const begin = Time.now();
	try {
		const input = papers.map((p) => `${p.payload.title} ${p.payload.abstract}`);
		let embeddings: number[][] | undefined = undefined;
		let errorCount = 0;

		do {
			try {
				const response = await openai.embeddings.create({
					model: vectorSpace.model,
					dimensions: vectorSpace.dimensions,
					input,
				});

				embeddings = response.data.map((d) => d.embedding);
			} catch (e) {
				console.error(e);
				if (errorCount >= 3) {
					throw e;
				}

				let maxSize = 0;
				let maxSizeIndex = 0;
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					if (item && item.length > maxSize) {
						maxSize = item.length;
						maxSizeIndex = i;
					}
				}
				console.log(
					`Removing item at index ${maxSizeIndex} with size ${maxSize}`,
				);
				console.log(input[maxSizeIndex]);
				input.splice(maxSizeIndex, 1);
				errorCount++;
			}
		} while (!embeddings);

		if (!embeddings) {
			throw new Error("Failed to generate embeddings");
		}

		await callback(embeddings.length, Time.elapsed(begin));

		return [papers, embeddings];
	} finally {
		Time.log(begin, `generateOpenAIEmbeddings(${papers.length})`);
	}
}

async function generateOpenAiEmbedding(
	text: string[],
	vectorSpace: VectorSpace,
): Promise<number[][]> {
	const begin = Time.now();
	try {
		return (
			await openai.embeddings.create({
				model: vectorSpace.model,
				dimensions: vectorSpace.dimensions,
				input: text.filter((t) => t?.length).join(" "),
			})
		).data.map((d) => d.embedding);
	} finally {
		Time.log(begin, `generateOpenAiEmbedding(${text?.length})`);
	}
}

const mistral = new Mistral({
	apiKey: process.env.MISTRAL_API_KEY,
});

async function generateMistralEmbeddings(
	papers: QdrantPaper[],
	vectorSpace: VectorSpace,
	callback: Callback,
): Promise<[QdrantPaper[], number[][]]> {
	if (!papers.length) {
		return [papers, []];
	}

	const begin = Time.now();
	try {
		const batchSize = 10;
		let embeddings: number[][] = [];

		for (let i = 0; i < papers.length; i += batchSize) {
			const batch = papers.slice(i, i + batchSize);
			const response = await mistral.embeddings.create({
				model: vectorSpace.model,
				inputs: batch.map((p) => `${p.payload.title} ${p.payload.abstract}`),
			});

			const batchEmbeddings = response.data
				.filter((d): d is { embedding: number[] } => d.embedding !== undefined)
				.map((d) => d.embedding);

			embeddings = embeddings.concat(batchEmbeddings);
		}
		await callback(embeddings.length, Time.elapsed(begin));

		return [papers, embeddings];
	} finally {
		Time.log(begin, `generateMistralEmbeddings(${papers.length})`);
	}
}

async function generateMistralEmbedding(
	text: string[],
	vectorSpace: VectorSpace,
): Promise<number[][]> {
	const begin = Time.now();

	try {
		const response = await mistral.embeddings.create({
			model: vectorSpace.model,
			inputs: text.filter((t) => t?.length),
		});

		return response.data
			.filter((d): d is { embedding: number[] } => d.embedding !== undefined)
			.map((d) => d.embedding);
	} finally {
		Time.log(begin, `generateMistralEmbedding(${text.length})`);
	}
}
