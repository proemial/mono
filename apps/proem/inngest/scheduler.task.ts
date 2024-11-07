import { Time } from "@proemial/utils/time";
import { inngest } from "./client";
import { streamScheduledCacheUpdate } from "./populator.task";
import { getAllSpaceIds } from "@proemial/data/repository/collection";
import { getAllUserIds } from "@proemial/data/repository/user";
import { NewsFlushTask } from "./news-flush.task";

export const newsFlushScheduler = inngest.createFunction(
	{ id: `schedule/${NewsFlushTask.name}` },
	{ cron: "*/5 * * * *" },
	async ({ event }) => {
		const result = await inngest.send({
			name: NewsFlushTask.name,
		});

		return { event, body: { result: result.ids } };
	},
);

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
		return await getAllUserIds();
	} finally {
		Time.log(begin, "getUserIds");
	}
}

async function getSpaceIds() {
	const begin = Time.now();

	try {
		return await getAllSpaceIds();
	} finally {
		Time.log(begin, "getSpacesIds");
	}
}
