import { getPaperIdsForCollection } from "@/app/(pages)/(app)/space/[collectionId]/collection-utils";
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

			if (!event.data.id) {
				throw new NonRetriableError("No id provided.");
			}

			return await populateCache(event.data, event);
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

			if (!event.data.id) {
				throw new NonRetriableError("No id provided.");
			}

			return await populateCache(event.data, event);
		},
	),
	run: async (id: string, type: "user" | "space") => {
		await inngest.send({
			name: cacheUpdateEventName,
			data: { id, type },
		});
	},
};

export async function populateCache(
	{ id, type }: { id: string; type: "user" | "space" },
	event?: { name?: string },
) {
	const begin = Time.now();
	try {
		const paperIds =
			type === "user"
				? await getHistory(id)
				: await getPaperIdsForCollection(id).then((ids) =>
						ids ? [ids] : [[]],
					);

		const features = await getFilter(paperIds);

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

async function getFilter(history?: string[][] | null) {
	const begin = Time.now();
	try {
		const fingerprints = history && (await fetchFingerprints(...history));
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
