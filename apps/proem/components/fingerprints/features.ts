import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import { Fingerprint } from "./fingerprints";

// Max no. of features to use
const MAX_COUNT = 30;

// Min score for a feature
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
	allFeatures: RankedFeature[];
	filter: RankedFeature[];
};

export function getFeatureFilter(fingerprints: Fingerprint[]): FeatureFilter {
	if (!fingerprints.length) {
		return { allFeatures: [], filter: [] };
	}

	const rankedFeatureMap = {} as {
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
			const count = rankedFeatureMap[key]?.count ?? 0;
			const avgScore = rankedFeatureMap[key]?.avgScore ?? 0;
			rankedFeatureMap[key] = {
				...feature,
				count: count + 1,
				avgScore: (avgScore + feature.score) / 2,
				coOccurrenceScore: 0,
			};
		}

		for (const key of Object.keys(rankedFeatureMap)) {
			const rankedFeature = rankedFeatureMap[key] as RankedFeature;
			rankedFeatureMap[key] = {
				...rankedFeature,
				coOccurrenceScore:
					(rankedFeature.count * rankedFeature.avgScore) / fingerprints.length,
			};
		}
	}

	const rankedFeatures = Object.values(rankedFeatureMap)
		.sort((a, b) => b.coOccurrenceScore - a.coOccurrenceScore)
		.map((item, i) => ({
			...item,
			irrelevant: i > MAX_COUNT || (item?.coOccurrenceScore ?? 0) < MIN_SCORE,
		}));

	return {
		allFeatures: rankedFeatures,
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
		const label = oaTopicsTranslationMap[item.id]?.["short-name"] as string;
		features[key] = asFeature(item, "topic", label);
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
