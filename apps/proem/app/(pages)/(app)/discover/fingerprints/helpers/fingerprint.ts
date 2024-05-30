import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import {
	OpenAlexConcept,
	OpenAlexKeyword,
	OpenAlexPaper,
	OpenAlexTopic,
} from "@proemial/models/open-alex";

export type Features = {
	id: string;
	topics: OpenAlexTopic[];
	concepts: OpenAlexConcept[];
	keywords: OpenAlexKeyword[];
};

export function getFeatures(paper?: OpenAlexPaper) {
	return {
		id: paper?.id,
		topics: paper?.data.topics,
		concepts: paper?.data.concepts,
		keywords: paper?.data.keywords,
	} as Features;
}

export type Types = "topic" | "keyword" | "concept";

export type Fingerprint = {
	id: string;
	label: string;
	type: Types;
	count: number;
	score: number;
};

export function getFingerprints(features: Features[]) {
	if (!features.length) {
		return [];
	}

	const fingerprintMap = {} as {
		[key: string]: Fingerprint;
	};
	const ids = {
		topics: [] as string[],
		concepts: [] as string[],
		keywords: [] as string[],
	};

	for (const feature of features) {
		for (const item of feature.topics) {
			// .slice(0, 1)) {
			const key = item.id;
			if (!ids.topics.includes(key)) {
				ids.topics.push(key);
			}

			const count = fingerprintMap[key]?.count ?? 0;
			const score = fingerprintMap[key]?.score ?? 0;
			const label = oaTopicsTranslationMap[item.id]?.["short-name"] as string;
			fingerprintMap[key] = {
				id: key,
				label,
				type: "topic",
				count: count + 1,
				score: (score + item.score) / 2,
			};
		}

		for (const item of feature.concepts) {
			const key = item.id;
			if (!ids.concepts.includes(key)) {
				ids.concepts.push(key);
			}

			const count = fingerprintMap[key]?.count ?? 0;
			const score = fingerprintMap[key]?.score ?? 0;
			fingerprintMap[key] = {
				id: key,
				label: item.display_name,
				type: "concept",
				count: count + 1,
				score: (score + item.score) / 2,
			};
		}

		for (const item of feature.keywords) {
			const key = item.id;
			if (!ids.keywords.includes(key)) {
				ids.keywords.push(key);
			}

			const count = fingerprintMap[key]?.count ?? 0;
			const score = fingerprintMap[key]?.score ?? 0;
			fingerprintMap[key] = {
				id: key,
				label: item.display_name,
				type: "keyword",
				count: count + 1,
				score: (score + item.score) / 2,
			};
		}
	}

	const fingerprints = Object.values(fingerprintMap)
		.filter(
			(item) =>
				// (featureSets.length === 1 || item.count > 1) &&
				item.score > 0.1,
		)
		.sort((a, b) => (a.score > b.score ? -1 : 1))
		.sort((a, b) => (a.count > b.count ? -1 : 1));

	return fingerprints;
}
