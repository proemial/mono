import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import {
	OpenAlexConcept,
	OpenAlexKeyword,
	OpenAlexPaper,
	OpenAlexTopic,
} from "@proemial/models/open-alex";

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

export type Types = "d" | "f" | "s" | "t" | "k" | "c";

export function getFingerprintFilter(fingerprints: Fingerprint[]) {
	if (!fingerprints.length) {
		return { features: [], filter: "" };
	}

	const filterTable = {} as {
		[key: string]: {
			id: string;
			label: string;
			type: Types;
			count: number;
			score: number;
		};
	};
	const ids = {
		topics: [] as string[],
		concepts: [] as string[],
		keywords: [] as string[],
	};

	for (const fingerprint of fingerprints) {
		for (const item of fingerprint.topics) {
			// .slice(0, 1)) {
			const key = item.id;
			if (!ids.topics.includes(key)) {
				ids.topics.push(key);
			}

			const count = filterTable[key]?.count ?? 0;
			const score = filterTable[key]?.score ?? 0;
			const label = oaTopicsTranslationMap[item.id]?.["short-name"] as string;
			filterTable[key] = {
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

			const count = filterTable[key]?.count ?? 0;
			const score = filterTable[key]?.score ?? 0;
			filterTable[key] = {
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

			const count = filterTable[key]?.count ?? 0;
			const score = filterTable[key]?.score ?? 0;
			filterTable[key] = {
				id: key,
				label: item.display_name,
				type: "k",
				count: count + 1,
				score: (score + item.score) / 2,
			};
		}
	}

	const features = Object.values(filterTable)
		.filter(
			(item) =>
				// (featureSets.length === 1 || item.count > 1) &&
				item.score > 0.1,
		)
		.sort((a, b) => (a.score > b.score ? -1 : 1))
		.sort((a, b) => (a.count > b.count ? -1 : 1));

	const topics = features
		.filter((item) => item.type === "t")
		.map((item) => item.id.split("/").at(-1))
		.join("|");
	const concepts = features
		.filter((item) => item.type === "c")
		.map((item) => item.id.split("/").at(-1))
		.join("|");

	const filter = `type:types/preprint|types/article,publication_date:%3C2024-05-28,publication_date:%3E2024-05-21,primary_topic.id:${topics},concepts.id:${concepts}`;

	return { features, filter };
}
