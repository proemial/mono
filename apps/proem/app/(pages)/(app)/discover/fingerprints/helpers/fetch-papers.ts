import {
	OpenAlexConcept,
	OpenAlexKeyword,
	OpenAlexTopic,
	OpenAlexWorksSearchResult,
	oaBaseArgs,
	oaBaseUrl,
} from "@proemial/models/open-alex";
import { fetchJson } from "@proemial/utils/fetch";

type WithTitle = {
	id: string;
	title: string;
};

type WithFeatures = {
	id: string;
	topics: OpenAlexTopic[];
	concepts: OpenAlexConcept[];
	keywords: OpenAlexKeyword[];
};

export async function fetchPapersTitles(ids: string[]): Promise<WithTitle[]> {
	return fetchPapers<WithTitle[]>(ids, "id,title");
}

export async function fetchFingerprints(
	ids: string[],
): Promise<WithFeatures[]> {
	return fetchPapers<WithFeatures[]>(ids, "id,topics,keywords,concepts");
}

async function fetchPapers<T>(ids: string[], select: string): Promise<T> {
	if (!ids?.length) {
		return [] as T;
	}
	const filter = `ids.openalex:${ids.join("|")}`;
	const url = `${oaBaseUrl}?${oaBaseArgs}&select=${select}&filter=${filter}`;

	const result = await fetchJson<OpenAlexWorksSearchResult>(url);

	return result.results as T;
}
