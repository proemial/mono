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

export type Types = "d" | "f" | "s" | "t" | "k" | "c";

export type Fingerprint = {
	id: string;
	label: string;
	type: Types;
	count: number;
	score: number;
};

export function getFingerprintFilter(features: Features[]) {
	if (!features.length) {
		return { features: [], filter: "" };
	}

	const fingerprints = {} as {
		[key: string]: Fingerprint;
	};
	const ids = {
		topics: [] as string[],
		concepts: [] as string[],
		keywords: [] as string[],
	};

	for (const fingerprint of features) {
		for (const item of fingerprint.topics) {
			// .slice(0, 1)) {
			const key = item.id;
			if (!ids.topics.includes(key)) {
				ids.topics.push(key);
			}

			const count = fingerprints[key]?.count ?? 0;
			const score = fingerprints[key]?.score ?? 0;
			const label = oaTopicsTranslationMap[item.id]?.["short-name"] as string;
			fingerprints[key] = {
				id: key,
				label,
				type: "t",
				count: count + 1,
				score: (score + item.score) / 2,
			};
		}

		for (const item of fingerprint.concepts) {
			const key = item.id;
			if (!ids.concepts.includes(key)) {
				ids.concepts.push(key);
			}

			const count = fingerprints[key]?.count ?? 0;
			const score = fingerprints[key]?.score ?? 0;
			fingerprints[key] = {
				id: key,
				label: item.display_name,
				type: "c",
				count: count + 1,
				score: (score + item.score) / 2,
			};
		}

		for (const item of fingerprint.keywords) {
			const key = item.id;
			if (!ids.keywords.includes(key)) {
				ids.keywords.push(key);
			}

			const count = fingerprints[key]?.count ?? 0;
			const score = fingerprints[key]?.score ?? 0;
			fingerprints[key] = {
				id: key,
				label: item.display_name,
				type: "k",
				count: count + 1,
				score: (score + item.score) / 2,
			};
		}
	}

	const filterItems = Object.values(fingerprints)
		.filter(
			(item) =>
				// (featureSets.length === 1 || item.count > 1) &&
				item.score > 0.1,
		)
		.sort((a, b) => (a.score > b.score ? -1 : 1))
		.sort((a, b) => (a.count > b.count ? -1 : 1));

	const topics = filterItems
		.filter((item) => item.type === "t")
		.map((item) => item.id.split("/").at(-1))
		.join("|");
	const concepts = filterItems
		.filter((item) => item.type === "c")
		.map((item) => item.id.split("/").at(-1))
		.join("|");

	const filter = `type:types/preprint|types/article,publication_date:%3C2024-05-28,publication_date:%3E2024-05-21,primary_topic.id:${topics},concepts.id:${concepts}`;

	return { features: filterItems, filter, fingerprints };
}
