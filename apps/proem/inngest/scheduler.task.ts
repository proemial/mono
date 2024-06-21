import { neonDb } from "@proemial/data";
import { Time } from "@proemial/utils/time";
import { inngest } from "./client";
import { streamScheduledCacheUpdate } from "./populator.task";

export const streamCacheUpdateScheduler = inngest.createFunction(
	{ id: "streams/cache-update-scheduler" },
	{ cron: "0 */6 * * *" },
	async ({ event }) => {
		const userIds = await getUserIds();
		const result = await inngest.send(
			userIds.map((userId) => ({
				name: streamScheduledCacheUpdate.name,
				data: { id: userId, type: "user" },
			})),
		);

		return { event, body: { userIds, result: result.ids } };
	},
);

export const spacesStreamCacheUpdateScheduler = inngest.createFunction(
	{ id: "spaces-streams/cache-update-scheduler" },
	{ cron: "0 */6 * * *" },
	async ({ event }) => {
		const spaceIds = await getSpaceIds();
		const result = await inngest.send(
			spaceIds.map((spaceId) => ({
				name: streamScheduledCacheUpdate.name,
				data: { id: spaceId, type: "space" },
			})),
		);

		return { event, body: { spaceIds, result: result.ids } };
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

async function getSpaceIds() {
	const begin = Time.now();

	try {
		const collections = await neonDb.query.collections.findMany();
		return collections.map((collection) => collection.id);
	} finally {
		Time.log(begin, "getSpacesIds");
	}
}
