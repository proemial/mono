import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import {
	OpenAlexConcept,
	OpenAlexKeyword,
	OpenAlexPaper,
	OpenAlexTopic,
} from "@proemial/models/open-alex";

const MAX_COUNT = 30;
const MIN_SCORE = 0.1;

export type Fingerprint = {
	id: string;
	topics: OpenAlexTopic[];
	concepts: OpenAlexConcept[];
	keywords: OpenAlexKeyword[];
};

export function getFingerprint(paper?: OpenAlexPaper) {
	return {
		id: paper?.id,
		topics: paper?.data.topics,
		concepts: paper?.data.concepts,
		keywords: paper?.data.keywords,
	} as Fingerprint;
}

export type FeatureType = "topic" | "keyword" | "concept";

export type RankedFeature = {
	id: string;
	label: string;
	type: FeatureType;
	count: number;
	avgOaScore: number;
	score?: number;
	disabled?: boolean;
};

export function filterByFingerprints(fingerprints: Fingerprint[]) {
	if (!fingerprints.length) {
		return { features: [], filter: [] };
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
		for (const item of fingerprint.topics) {
			const key = item.id;
			if (!ids.topics.includes(key)) {
				ids.topics.push(key);
			}

			const count = rankedFeatureMap[key]?.count ?? 0;
			const score = rankedFeatureMap[key]?.avgOaScore ?? 0;
			const label = oaTopicsTranslationMap[item.id]?.["short-name"] as string;
			rankedFeatureMap[key] = {
				id: key,
				label,
				type: "topic",
				count: count + 1,
				avgOaScore: (score + item.score) / 2,
			};
		}

		for (const item of fingerprint.concepts) {
			const key = item.id;
			if (!ids.concepts.includes(key)) {
				ids.concepts.push(key);
			}

			const count = rankedFeatureMap[key]?.count ?? 0;
			const score = rankedFeatureMap[key]?.avgOaScore ?? 0;
			rankedFeatureMap[key] = {
				id: key,
				label: item.display_name,
				type: "concept",
				count: count + 1,
				avgOaScore: (score + item.score) / 2,
			};
		}

		for (const item of fingerprint.keywords) {
			const key = item.id;
			if (!ids.keywords.includes(key)) {
				ids.keywords.push(key);
			}

			const count = rankedFeatureMap[key]?.count ?? 0;
			const score = rankedFeatureMap[key]?.avgOaScore ?? 0;
			rankedFeatureMap[key] = {
				id: key,
				label: item.display_name,
				type: "keyword",
				count: count + 1,
				avgOaScore: (score + item.score) / 2,
			};
		}

		for (const key of Object.keys(rankedFeatureMap)) {
			const item = rankedFeatureMap[key] as RankedFeature;
			rankedFeatureMap[key] = {
				...item,
				score: (item.count * item.avgOaScore) / fingerprints.length,
			};
		}
	}

	const rankedFeatures = Object.values(rankedFeatureMap)
		.sort((a, b) => (a.avgOaScore > b.avgOaScore ? -1 : 1))
		.sort((a, b) => (a.count > b.count ? -1 : 1))
		.map((item, i) => ({
			...item,
			disabled: i > MAX_COUNT || (item?.score ?? 0) < MIN_SCORE,
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
