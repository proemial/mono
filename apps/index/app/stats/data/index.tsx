import { vectorSpaces } from "@/data/db/vector-spaces";
import { QdrantClient } from "@qdrant/js-client-rest";
import DbChart from "./db-chart";

export default async function DbGraph() {
	const client = new QdrantClient({
		url: process.env.QDRANT_URL,
		apiKey: process.env.QDRANT_API_KEY,
	});

	const spaces = Object.values(vectorSpaces);
	const results = await Promise.all(
		spaces.map(
			async (collection) => await client.getCollection(collection.collection),
		),
	);

	return (
		<div className="w-full">
			<div className="mb-4 text-3xl font-bold text-center">Paper count</div>
			<DbChart
				data={spaces.map((s, i) => ({
					key: s.collection,
					value: results[i]?.points_count as number,
				}))}
			/>
		</div>
	);
}
