import { inngest } from "../client";
import { oaSinceYesterday as ingest } from "../workers/oa/oa-yesterday.task";

export const oaScheduler = inngest.createFunction(
	{ id: `schedule/${ingest.name}` },
	{ cron: "0 4 * * *" },
	async ({ event }) => {
		const result = await inngest.send({
			name: ingest.name,
		});

		return { event, body: { result: result.ids } };
	},
);
