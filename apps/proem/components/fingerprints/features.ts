import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import { Fingerprint } from "./fingerprints";

const MAX_COUNT = 30;
const MIN_SCORE = 0.1;

export type FeatureType = "topic" | "keyword" | "concept";

export type RankedFeature = {
	id: string;
	label: string;
	type: FeatureType;
	count: number;
	avgScore: number;
	coOccurrenceScore: number;
	irrelevant?: boolean;
};

export type FeatureFilter = {
	features: RankedFeature[];
	filter: RankedFeature[];
};

export function getFeatureFilter(fingerprints: Fingerprint[]): FeatureFilter {
	if (!fingerprints.length) {
		return { features: [], filter: [] };
	}

	const featureMap = {} as {
		[key: string]: RankedFeature;
	};
	const ids = {
		topics: [] as string[],
		concepts: [] as string[],
		keywords: [] as string[],
	};

	for (const fingerprint of fingerprints) {
		for (const item of fingerprint.topics) {
			const key = item.id;
			if (!ids.topics.includes(key)) {
				ids.topics.push(key);
			}

			const count = featureMap[key]?.count ?? 0;
			const score = featureMap[key]?.avgScore ?? 0;
			const label = oaTopicsTranslationMap[item.id]?.["short-name"] as string;
			featureMap[key] = {
				id: key,
				label,
				type: "topic",
				count: count + 1,
				avgScore: (score + item.score) / 2,
				coOccurrenceScore: 0,
			};
		}

		for (const item of fingerprint.concepts) {
			const key = item.id;
			if (!ids.concepts.includes(key)) {
				ids.concepts.push(key);
			}

			const count = featureMap[key]?.count ?? 0;
			const score = featureMap[key]?.avgScore ?? 0;
			featureMap[key] = {
				id: key,
				label: item.display_name,
				type: "concept",
				count: count + 1,
				avgScore: (score + item.score) / 2,
				coOccurrenceScore: 0,
			};
		}

		for (const item of fingerprint.keywords) {
			const key = item.id;
			if (!ids.keywords.includes(key)) {
				ids.keywords.push(key);
			}

			const count = featureMap[key]?.count ?? 0;
			const score = featureMap[key]?.avgScore ?? 0;
			featureMap[key] = {
				id: key,
				label: item.display_name,
				type: "keyword",
				count: count + 1,
				avgScore: (score + item.score) / 2,
				coOccurrenceScore: 0,
			};
		}

		for (const key of Object.keys(featureMap)) {
			const item = featureMap[key] as RankedFeature;
			featureMap[key] = {
				...item,
				coOccurrenceScore: (item.count * item.avgScore) / fingerprints.length,
			};
		}
	}

	const rankedFeatures = Object.values(featureMap)
		.sort((a, b) => (a.avgScore > b.avgScore ? -1 : 1))
		.sort((a, b) => (a.count > b.count ? -1 : 1))
		.map((item, i) => ({
			...item,
			disabled: i > MAX_COUNT || (item?.coOccurrenceScore ?? 0) < MIN_SCORE,
		}));

	return {
		features: rankedFeatures,
		filter: rankedFeatures.filter((f) => !f.disabled),
	};
}

export function findFilterHits(
	features: { id: string }[],
	filter: RankedFeature[],
) {
	return features.filter((item) => !!filter.find((f) => f.id === item.id));
}
