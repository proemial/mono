"use server";
import dayjs from "dayjs";
import DbGraph from "./data";
import IngestionGraph from "./ingestion";
import { sinceQuery } from "@/inngest/helpers/openalex";

export default async function StatsPage() {
	const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

	// https://api.openalex.org/works?mailto=lab@proemial.ai&api_key=AuEVGBBSG9SBwo6LV8hhxh&
	const query = sinceQuery(yesterday);

	return (
		<>
			<div className="flex">
				<div className="w-2/3">
					<IngestionGraph />
				</div>
				<div className="w-1/3">
					<DbGraph />
				</div>
			</div>
			<div className="ml-16">
				<div>
					Ingestion url:{" "}
					<code className="bg-gray-100 p-2 rounded">{query}</code>
				</div>
			</div>
		</>
	);
}
