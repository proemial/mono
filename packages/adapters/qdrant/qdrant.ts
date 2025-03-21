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

export type QdrantPoint = {
	id: string;
	vector: number[];
	payload: {
		metadata: EventMetadata;
		url: string;
		content: string;
		type?: string;
	};
};

export const Qdrant = {
	search: async (metadata: EventMetadata, query: string) => {
		return await search(metadata, query);
	},
	upsert: async (
		metadata: EventMetadata,
		scrapedUrl: ScrapedUrl,
		embedding?: number[],
	) => {
		return await upsert(
			metadata,
			scrapedUrl.url,
			scrapedUrl.content.text,
			embedding,
		);
	},
};

async function search(metadata: EventMetadata, query: string) {
	const embeddings = await generateEmbedding(LlmModels.assistant.embeddings(), [
		query,
	]);

	const collectionId = getCollectionId(metadata);
	const references = await qdrant.points.search(collectionId, {
		vector: embeddings.at(0) as number[],
		limit: 10,
	});

	return references.map((reference) => ({
		payload: reference.payload,
		score: reference.score,
	}));
}

async function upsert(
	metadata: EventMetadata,
	url: string,
	content: string,
	embedding?: number[],
) {
	const collectionId = getCollectionId(metadata);
	const id = getPointId(url);

	console.log(`Upserting ${id} to ${collectionId}`);

	const collection = await qdrant.spaces.exists(collectionId);
	if (!collection.exists) {
		console.log(`Creating collection ${collectionId}`);
		await qdrant.spaces.create(collectionId, {
			vectors: {
				size: 1536,
				distance: "Cosine",
			},
		});
	}

	const point = await qdrant.points.exists(collectionId, id);
	console.log(`Point exists: ${JSON.stringify(point)}`);
	if (point.length > 0) {
		console.log(`Skipping ${id} because it already exists`);
		return;
	}

	const vector = embedding ?? (await embed(content));
	if (!vector) {
		throw new Error("No vector");
	}

	await qdrant.points.upsert(collectionId, [
		{
			id,
			vector,
			payload: {
				metadata,
				url,
				content,
				type: slackUrlType(url),
			},
		},
	]);
}

async function embed(content: string) {
	const tokenLength = getTokenLength(content);
	if (tokenLength > OPENAI_EMBEDDING_MAX_TOKENS) {
		// Split text into chunks that fit within token limit
		const averageVector = await computeAverageVector(content);
		return averageVector;
	}

	const embeddings = await generateEmbedding(LlmModels.assistant.embeddings(), [
		content,
	]);
	return embeddings.at(0);
}

export function slackUrlType(url: string) {
	return url.startsWith("https://files.slack.com") ? "file" : "url";
}

function getCollectionId(metadata: EventMetadata) {
	return `${metadata.teamId}_${metadata.context?.channelId}`;
}

function getPointId(url: string) {
	return uuid(url, "qdrant");
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
