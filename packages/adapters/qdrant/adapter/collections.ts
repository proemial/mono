import { QdrantClient } from "@qdrant/js-client-rest";

export async function getCollection(client: QdrantClient, name: string) {
	return await client.getCollection(name);
}

export async function listCollections(client: QdrantClient) {
	return await client.getCollections();
}

export async function createCollection(
	client: QdrantClient,
	name: string,
	config: Config,
) {
	return await client.createCollection(name, config);
}

export async function deleteCollection(client: QdrantClient, name: string) {
	return await client.deleteCollection(name);
}

export async function collectionExists(client: QdrantClient, name: string) {
	return await client.collectionExists(name);
}

export type Config = Parameters<QdrantClient["createCollection"]>[1];
