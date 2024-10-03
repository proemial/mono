import { IngestionStats } from "../stats.models";
import IngestionChart from "./ingestion-chart";

export default async function IngestionGraph() {
	const response = await fetch(
		`https://api.eu-central-1.aws.tinybird.co/v0/pipes/ingestLog_pipe_5053.json?token=${process.env.TINYBIRD_TOKEN}`,
		{ cache: "no-store" },
	);
	const stats = (await response.json()) as IngestionStats;

	return (
		<div className="w-full">
			<div className="mb-4 text-3xl font-bold text-center">Ingestion stats</div>
			<IngestionChart stats={stats} />
		</div>
	);
}
