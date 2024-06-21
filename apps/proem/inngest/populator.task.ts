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

export const populator = inngest.createFunction(
	{ id: "populate-cache", concurrency: 1 },
	{ event: "feed/cache.populate" },
	async ({ event }) => {
		console.log("event", event);

		if (!event.data.userId) {
			throw new NonRetriableError("No userId provided.");
		}

		return await populateCache(event.data.userId, event);
	},
);

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
		console.log("history", history);

		const fingerprints = await fetchFingerprints(...history);
		console.log("fingerprints", fingerprints);

		const { filter } = getFeatureFilter(fingerprints);
		console.log("filter", filter);

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
