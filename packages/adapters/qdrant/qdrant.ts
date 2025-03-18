import { generateEmbedding } from "../llm/embeddings";
import LlmModels from "../llm/models";
import { EventMetadata } from "../mongodb/slack/v2.models";
import { ScrapedUrl } from "../mongodb/slack/scraped.types";
import qdrantHelper from "../qdrant/adapter";
import { uuid5 as uuid } from "@proemial/utils/uuid";
import { getTokenLength } from "../tokens/token-length";

const OPENAI_EMBEDDING_MAX_TOKENS = 8192;

const qdrant = qdrantHelper({
	url: process.env.QDRANT_URL as string,
	apiKey: process.env.QDRANT_API_KEY as string,
});

export const Qdrant = {
	search: async (metadata: EventMetadata, query: string) => {
		return await search(metadata, query);
	},
	vectorize: async (metadata: EventMetadata, scrapedUrl: ScrapedUrl) => {
		return await vectorize(metadata, scrapedUrl);
	},
};

async function search(metadata: EventMetadata, query: string) {
	const embeddings = await generateEmbedding(LlmModels.assistant.embeddings(), [
		query,
	]);

	const references = await qdrant.points.search("scraped", {
		vector: embeddings.at(0) as number[],
		limit: 10,
	});

	return references.map((reference) => reference.payload);
}

async function vectorize(metadata: EventMetadata, scrapedUrl: ScrapedUrl) {
	const tokenLength = getTokenLength(scrapedUrl.content.text);
	if (tokenLength > OPENAI_EMBEDDING_MAX_TOKENS) {
		// Split text into chunks that fit within token limit
		const averageVector = await computeAverageVector(scrapedUrl.content.text);

		const points = [
			{
				id: getId(metadata, scrapedUrl.url),
				vector: averageVector,
				payload: {
					metadata,
					url: scrapedUrl.url,
					type: scrapedUrl.type,
					content: scrapedUrl.content,
				},
			},
		];

		await qdrant.points.upsert("scraped", points);
	} else {
		const embeddings = await generateEmbedding(
			LlmModels.assistant.embeddings(),
			[scrapedUrl.content.text],
		);

		const points = embeddings.map((vector, i) => ({
			id: getId(metadata, scrapedUrl.url),
			vector,
			payload: {
				metadata,
				url: scrapedUrl.url,
				type: scrapedUrl.type,
				content: scrapedUrl.content,
			},
		}));

		await qdrant.points.upsert("scraped", points);
	}
}

function getId(metadata: EventMetadata, url: string) {
	return uuid(
		`${metadata.appId}_${metadata.teamId}_${metadata.context?.channelId}_${url}`,
		"qdrant",
	);
}

async function computeAverageVector(text: string) {
	const sentences = text.split(/(?<=\.|\?|\!)\s+/);
	const chunks: string[] = [];
	let currentChunk = "";

	for (const sentence of sentences) {
		const potentialChunk = currentChunk + (currentChunk ? " " : "") + sentence;
		if (getTokenLength(potentialChunk) <= OPENAI_EMBEDDING_MAX_TOKENS) {
			currentChunk = potentialChunk;
		} else {
			if (currentChunk) {
				chunks.push(currentChunk);
			}
			currentChunk = sentence;
		}
	}
	if (currentChunk) {
		chunks.push(currentChunk);
	}

	console.log(
		`Text exceeds ${OPENAI_EMBEDDING_MAX_TOKENS} tokens, chunked into ${chunks.length} chunks`,
	);

	const embeddings = await Promise.all(
		chunks.map((chunk) =>
			generateEmbedding(LlmModels.assistant.embeddings(), [chunk]),
		),
	);

	if (embeddings.length === 0) {
		throw new Error("No embeddings generated");
	}

	// Calculate average vector across all embeddings
	const dimensions = embeddings[0]?.[0]?.length ?? 0;
	if (dimensions === 0) {
		throw new Error("No dimensions found");
	}
	const averageVector: number[] = new Array(dimensions).fill(0);

	for (const embedding of embeddings) {
		const vector = embedding[0]; // Each embedding is an array containing one vector
		for (let i = 0; i < dimensions; i++) {
			// @ts-ignore: Dimensions are identical for all embeddings
			averageVector[i] += vector[i]; // Sum up all corresponding vector components
		}
	}

	// Divide by number of embeddings to get average
	for (let i = 0; i < dimensions; i++) {
		// @ts-ignore: Dimensions are identical for all embeddings
		averageVector[i] /= embeddings.length;
	}

	return averageVector;
}
