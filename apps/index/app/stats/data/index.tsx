import { vectorSpaces } from "@/data/db/vector-spaces";
import { QdrantClient } from "@qdrant/js-client-rest";
import {
	PaperCountInIndicesChart,
	PaperCountInLatestIndexChart,
} from "./db-chart";
import dayjs from "dayjs";

const client = new QdrantClient({
	url: process.env.QDRANT_URL,
	apiKey: process.env.QDRANT_API_KEY,
});

export default async function DbGraph() {
	const spaces = Object.values(vectorSpaces);
	const results = await Promise.all(
		spaces.map(
			async (collection) => await client.getCollection(collection.collection),
		),
	);
	const distribution = await getDistribution();

	return (
		<div className="w-full">
			<div className="mb-4 text-3xl font-bold text-center">Paper count</div>
			<PaperCountInIndicesChart
				data={spaces.map((s, i) => ({
					key: s.collection,
					value: results[i]?.points_count as number,
				}))}
			/>
			<PaperCountInLatestIndexChart data={distribution} />
		</div>
	);
}

async function getDistribution() {
	const latestSpace = Object.values(vectorSpaces).at(-1)?.collection as string;

	const dates = Array.from({ length: 30 }, (_, i) => {
		return dayjs().subtract(i, "day").format("YYYY-MM-DD");
	}).reverse();

	const counts = await Promise.all(
		dates.map(
			async (date) =>
				await client.count(latestSpace, {
					filter: {
						must: [
							{
								key: "publication_date",
								range: {
									gte: date,
									lte: dayjs(date).add(1, "day").format("YYYY-MM-DD"),
								},
							},
						],
					},
				}),
		),
	);

	return dates.map((date, i) => ({
		key: dayjs(date).format("DD/MM"),
		value: counts[i]?.count as number,
	}));
}
