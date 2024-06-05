import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import { Fingerprint } from "./fingerprints";

const MAX_COUNT = 30;
const MIN_SCORE = 0.1;

export type FeatureType = "topic" | "keyword" | "concept";

export type Feature = {
	id: string;
	label: string;
	type: FeatureType;
	score: number;
};

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
		const features = getFeatures(fingerprint);

		for (const feature of features) {
			const key = feature.id;
			if (!ids.topics.includes(key)) {
				ids.topics.push(key);
			}
			const count = featureMap[key]?.count ?? 0;
			const score = featureMap[key]?.avgScore ?? 0;
			featureMap[key] = {
				...feature,
				count: count + 1,
				avgScore: (score + feature.score) / 2,
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
			irrelevant: i > MAX_COUNT || (item?.coOccurrenceScore ?? 0) < MIN_SCORE,
		}));

	return {
		features: rankedFeatures,
		filter: rankedFeatures.filter((f) => !f.irrelevant),
	};
}

export function getFeatures(fingerprint: Fingerprint): Feature[] {
	const features = {} as {
		[key: string]: Feature;
	};

	const asFeature = (
		item: { id: string; display_name: string; score: number },
		type: FeatureType,
		label?: string,
	): Feature => ({
		id: item.id,
		score: item.score,
		label: label ?? item.display_name,
		type,
	});

	for (const item of fingerprint.topics) {
		const key = item.id;
		features[key] = asFeature(
			item,
			"topic",
			oaTopicsTranslationMap[item.id]?.["short-name"] as string,
		);
	}

	for (const item of fingerprint.concepts) {
		const key = item.id;
		features[key] = asFeature(item, "concept");
	}

	for (const item of fingerprint.keywords) {
		const key = item.id;
		features[key] = asFeature(item, "keyword");
	}

	return Object.values(features);
}

export function findFilterHits(
	features: { id: string }[],
	filter: RankedFeature[],
) {
	return features.filter((item) => !!filter.find((f) => f.id === item.id));
}
