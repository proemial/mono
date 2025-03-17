import { generateEmbedding } from "@proemial/adapters/llm/embeddings";
import LlmModels from "@proemial/adapters/llm/models";
import { EventMetadata } from "@proemial/adapters/mongodb/slack/v2.models";
import { ScrapedUrl } from "@proemial/adapters/mongodb/slack/scraped.types";
import qdrantHelper from "@proemial/adapters/qdrant/adapter";
import { uuid5 as uuid } from "@proemial/utils/uuid";

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
	const embeddings = await generateEmbedding(LlmModels.assistant.embeddings(), [
		scrapedUrl.content.text,
	]);

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

function getId(metadata: EventMetadata, url: string) {
	return uuid(
		`${metadata.appId}_${metadata.teamId}_${metadata.context?.channelId}_${url}`,
		"qdrant",
	);
}
