"use server";
import DbGraph from "./data";
import IngestionGraph from "./ingestion";

export default async function StatsPage() {
	return (
		<div className="flex">
			<div className="w-2/3">
				<IngestionGraph />
			</div>
			<div className="w-1/3">
				<DbGraph />
			</div>
		</div>
	);
}
