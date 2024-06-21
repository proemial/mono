import { neonDb } from "@proemial/data";
import { Time } from "@proemial/utils/time";
import { inngest } from "./client";
import { scheduledCacheUpdate } from "./populator.task";

export const scheduler = inngest.createFunction(
	{ id: "streams-scheduler" },
	{ cron: "* */6 * * *" },
	async ({ event }) => {
		const userIds = await getUserIds();
		const result = await inngest.send(
			userIds.map((userId) => ({
				name: scheduledCacheUpdate.event,
				data: { userId },
			})),
		);

		return { event, body: { userIds, result: result.ids } };
	},
);

async function getUserIds() {
	const begin = Time.now();

	try {
		const users = await neonDb.query.users.findMany();
		return users.map((user) => user.id);
	} finally {
		Time.log(begin, "getUserIds");
	}
}
