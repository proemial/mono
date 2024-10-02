"use server";
import IngestionChart from "./chart";
import { IngestionStats } from "./stats.models";

export default async function StatsPage() {
	const response = await fetch(
		`https://api.eu-central-1.aws.tinybird.co/v0/pipes/ingestLog_pipe_5053.json?token=${process.env.TINYBIRD_TOKEN}`,
		{ cache: "no-store" },
	);
	const stats = (await response.json()) as IngestionStats;

	return (
		<>
			<div className="mb-4 text-3xl font-bold text-center">Ingestion stats</div>
			<IngestionChart stats={stats} />
		</>
	);
}
