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
