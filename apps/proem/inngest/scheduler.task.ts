import { neonDb } from "@proemial/data";
import { Time } from "@proemial/utils/time";
import { inngest } from "./client";

export const scheduler = inngest.createFunction(
	{ id: "feed-scheduler" },
	{ cron: "0 */6 * * *" },
	async ({ event, step }) => {
		const userIds = await getUserIds();
		const result = await inngest.send(
			userIds.map((userId) => ({
				name: "feed/cache.populate",
				data: { userId },
			})),
		);

		return { event, body: { userIds } };
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
