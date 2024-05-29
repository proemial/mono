import {
	OpenAlexWorksSearchResult,
	oaBaseArgs,
	oaBaseUrl,
} from "@proemial/models/open-alex";
import { fetchJson } from "@proemial/utils/fetch";

type Result = {
	id: string;
	title: string;
};

export async function fetchPapersTitles(ids: string[]): Promise<Result[]> {
	const filter = `ids.openalex:${ids.join("|")}`;
	const url = `${oaBaseUrl}?${oaBaseArgs}&select=id,title&filter=${filter}`;

	const result = await fetchJson<OpenAlexWorksSearchResult>(url);

	return result.results;
}
