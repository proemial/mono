import { fetchJson } from "@proemial/utils/fetch";
import {
	OpenAlexWorksSearchResult,
	oaBaseArgs,
	oaBaseUrl,
} from "../models/oa-paper";
import { Fingerprint } from "./fingerprints";

type WithTitle = {
	id: string;
	title: string;
};

export async function fetchPapersTitles(idGroups: Array<string[]>) {
	return await Promise.all(
		idGroups.map((ids) => fetchPapers<WithTitle[]>(ids, "id,title")),
	);
}

// TODO: Support lastRead / readCount
export async function fetchFingerprints(
	idGroups: Array<string[]>,
): Promise<Array<Fingerprint[]>> {
	return await Promise.all(
		idGroups.map((ids) =>
			fetchPapers<Fingerprint[]>(ids, "id,topics,keywords,concepts"),
		),
	);
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
