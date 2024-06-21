import { fetchFeedByFeatures } from "@/app/data/fetch-feed";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import {
	RankedFeature,
	getFeatureFilter,
} from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { Time } from "@proemial/utils/time";
import { NonRetriableError } from "inngest";
import { inngest } from "./client";

const scheduledCacheUpdateEventName = "streams/cache.update.scheduled";
export const streamScheduledCacheUpdate = {
	name: scheduledCacheUpdateEventName,
	worker: inngest.createFunction(
		{ id: "streams/scheduled-cache-update", concurrency: 3 },
		{ event: scheduledCacheUpdateEventName },
		async ({ event }) => {
			console.log("event", event);

			if (!event.data.userId) {
				throw new NonRetriableError("No userId provided.");
			}

			return await populateCache(event.data.userId, event);
		},
	),
};

const cacheUpdateEventName = "streams/cache.update";
export const streamCacheUpdate = {
	name: cacheUpdateEventName,
	worker: inngest.createFunction(
		{ id: "streams/cache-update" },
		{ event: cacheUpdateEventName },
		async ({ event }) => {
			console.log("event", event);

			if (!event.data.userId) {
				throw new NonRetriableError("No userId provided.");
			}

			return await populateCache(event.data.userId, event);
		},
	),
	run: async (userId: string) => {
		await inngest.send({
			name: cacheUpdateEventName,
			data: { userId },
		});
	},
};

export async function populateCache(userId: string, event?: { name?: string }) {
	const begin = Time.now();
	try {
		const history = await getHistory(userId);
		const features = await getFilter(history);

		// Implicitely updates the next unstable_cache
		const papers = await getFeed(features);

		return {
			event,
			body: {
				papers: papers.count,
				elapsed: Time.elapsed(begin),
			},
		};
	} finally {
		Time.log(begin, "populateCache");
	}
}

async function getHistory(userId: string) {
	const begin = Time.now();
	try {
		return await getBookmarksAndHistory(userId);
	} finally {
		Time.log(begin, "getHistory");
	}
}

async function getFilter(history: string[][]) {
	const begin = Time.now();
	try {
		const fingerprints = await fetchFingerprints(...history);
		const { filter } = getFeatureFilter(fingerprints);

		return filter;
	} finally {
		Time.log(begin, "getFilter");
	}
}

async function getFeed(features: RankedFeature[]) {
	const begin = Time.now();
	try {
		return await fetchFeedByFeatures({ features }, {});
	} finally {
		Time.log(begin, "getFeed");
	}
}
