import { QdrantClient } from "@qdrant/js-client-rest";

export async function countPoints(
	client: QdrantClient,
	name: string,
	filter: CountFilter,
) {
	return await client.count(name, filter);
}

export async function searchPoints(
	client: QdrantClient,
	name: string,
	filter: SearchFilter,
) {
	return await client.search(name, filter);
}

export async function scrollPoints(
	client: QdrantClient,
	name: string,
	filter: ScrollFilter,
) {
	return await client.scroll(name, filter);
}

export type CountFilter = Parameters<QdrantClient["count"]>[1];

export type SearchFilter = Parameters<QdrantClient["search"]>[1];

export type ScrollFilter = Parameters<QdrantClient["scroll"]>[1];
