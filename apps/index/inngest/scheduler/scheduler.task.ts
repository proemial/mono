import { inngest } from "../client";
import { oaSinceYesterday as ingest } from "../workers/oa/since-yesterday.task";

export const ingestionScheduler = inngest.createFunction(
	{ id: `schedule/${ingest.name}` },
	{ cron: "0 6,19 * * *" },
	async ({ event }) => {
		const result = await inngest.send({
			name: ingest.name,
		});

		return { event, body: { result: result.ids } };
	},
);
