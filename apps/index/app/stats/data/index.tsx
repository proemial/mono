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

export default async function DbGraph({ space }: { space?: string }) {
	const spaces = Object.values(vectorSpaces);
	const results = await Promise.all(
		spaces.map(
			async (collection) => await client.getCollection(collection.collection),
		),
	);
	const distribution = await getDistribution(space);

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

async function getDistribution(space?: string) {
	const latestSpace =
		space ?? (Object.values(vectorSpaces).at(-1)?.collection as string);

	const startOfYear = dayjs().startOf("year");
	const today = dayjs();
	const weeksSinceNewYear = today.diff(startOfYear, "week");

	const dates = Array.from({ length: weeksSinceNewYear }, (_, i) => {
		const weekStart = startOfYear.add(i, "week").format("YYYY-MM-DD");
		return weekStart;
	});

	const counts = await Promise.all(
		dates.map(
			async (weekStart) =>
				await client.count(latestSpace, {
					filter: {
						must: [
							{
								key: "publication_date",
								range: {
									gte: weekStart,
									lte: dayjs(weekStart).add(1, "week").format("YYYY-MM-DD"),
								},
							},
						],
					},
				}),
		),
	);

	return dates.map((date, i) => ({
		key: `w${i + 1}`,
		value: counts[i]?.count as number,
	}));
}
