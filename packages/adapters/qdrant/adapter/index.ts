import { QdrantClient } from "@qdrant/js-client-rest";
import * as space from "./collections";
import * as points from "./points";

const spaceDefaults = {
	vectors: {
		size: 768,
		distance: "Cosine",
	},
};

export default function qdrantHelper(args: { url: string; apiKey: string }) {
	const client = new QdrantClient(args);

	return {
		spaces: {
			create: (name: string, config?: space.Config) =>
				space.createCollection(client, name, {
					...spaceDefaults,
					...(config ?? {}),
				} as space.Config),

			delete: (name: string) => space.deleteCollection(client, name),

			list: () => space.listCollections(client),

			get: (name: string) => space.getCollection(client, name),

			exists: (name: string) => space.collectionExists(client, name),
		},

		points: {
			count: (name: string, filter?: points.CountFilter) =>
				points.countPoints(client, name, filter),

			search: (name: string, filter: points.SearchFilter) =>
				points.searchPoints(client, name, filter),

			scroll: (name: string, filter?: points.ScrollFilter) =>
				points.scrollPoints(client, name, filter),

			insert: (name: string, data: { vector: number[]; payload: unknown }[]) =>
				points.insertPoints(client, name, data),
		},
	};
}
