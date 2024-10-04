import {
	oaBaseArgs,
	oaBaseUrl,
	OpenAlexWorksHit,
	OpenAlexWorksSearchResult,
} from "@proemial/repositories/oa/models/oa-paper";
import { fetchJson } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";
import { IndexedPaper, Provider } from "./paper.model";
import dayjs from "dayjs";

export async function fetchFromOpenAlex(
	params: string,
	provider: Provider = "openalex",
) {
	const { meta, results } = await fetchJson<OpenAlexWorksSearchResult>(
		`${oaBaseUrl}?${oaBaseArgs}&${params}`,
		{ cache: "no-store" },
	);

	// Filter out papers that don't have a title and abstract
	const withTitleAndAbstract = (paper: OpenAlexWorksHit) =>
		!!paper.abstract_inverted_index && !!paper.title;

	const papers = results.filter(withTitleAndAbstract).map((paper) => {
		// Remove the abstract_inverted_index and relevance_score from the response
		const { abstract_inverted_index, relevance_score, ...rest } = paper;

		return {
			data: {
				...rest,
				abstract: fromInvertedIndex(abstract_inverted_index, 350),
				provider,
			},
		} as IndexedPaper;
	});

	return { meta, papers };
}

export function sinceQuery(date: string) {
	const sinceDate = dayjs(date).format("YYYY-MM-DD");

	const limit = 200;
	const since = dayjs(sinceDate).subtract(1, "month").format("YYYY-MM-DD");

	// type:types/preprint|types/article,has_abstract:true,language:en,open_access.is_oa:true
	const filter = [
		"type:types/preprint|types/article",
		"has_abstract:true",
		"language:en",
		"open_access.is_oa:true",
		`from_publication_date:${since}`,
		`from_created_date:${since}`,
		`from_updated_date:${sinceDate}`,
	]
		.filter((f) => !!f)
		.join(",");

	return `filter=${filter}&per_page=${limit}`;
}
