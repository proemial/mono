import {
	oaBaseArgs,
	oaBaseUrl,
	OpenAlexPaper,
	OpenAlexWorksHit,
	OpenAlexWorksSearchResult,
} from "@proemial/repositories/oa/models/oa-paper";
import { fetchJson } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";

export type Provider = "openalex" | "arxiv";
export type IndexedPaper = OpenAlexPaper & { data: { provider: Provider } };

export async function fetchWithAbstract(
	params: string,
	provider: Provider = "openalex",
) {
	const { meta, results } = await fetchJson<OpenAlexWorksSearchResult>(
		`${oaBaseUrl}?${oaBaseArgs}&${params}`,
	);

	const withTitleAndAbstract = (paper: OpenAlexWorksHit) =>
		!!paper.abstract_inverted_index && paper.title;

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
