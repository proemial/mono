import {
	oaBaseArgs,
	oaBaseUrl,
	OpenAlexWorksHit,
	OpenAlexWorksSearchResult,
} from "@proemial/repositories/oa/models/oa-paper";
import { fetchJson } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";
import { IndexedPaper, Provider } from "./paper.model";

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
