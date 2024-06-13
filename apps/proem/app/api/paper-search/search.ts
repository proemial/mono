import { Metrics } from "@/components/analytics/sentry/metrics";
import {
	OpenAlexPaperWithAbstract,
	OpenAlexWorksSearchResult,
	oaBaseArgs,
	oaBaseUrl,
	openAlexFields,
} from "../../../../../packages/repositories/oa/models/oa-paper";
// ,publication_date:>2023-10-16,publication_date:<2023-11-16
import { fetchJson } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";
import { Time } from "@proemial/utils/time";

const filter = "filter=type:article,cited_by_count:>10,cited_by_count:<1000";
export const askOaBaseUrl = `${oaBaseUrl}?${oaBaseArgs}&select=${openAlexFields.search}&${filter}`;

export type Paper = {
	link: string;
	title: string;
	abstract?: string;
	metadata?: string;
	publicationDate?: string;
};

type FetchConfig = {
	count?: number;
	tokens?: number;
	metadata?: string;
};

export async function fetchPapers(q: string, config?: FetchConfig) {
	const papers = await fetchWithAbstract(
		q,
		config?.count ?? 30,
		config?.tokens ?? 350,
	);

	return papers.map((o) => ({
		link: o.id.replace("openalex.org", "proem.ai/oa"),
		abstract: o.abstract,
		title: o.title,
		metadata: config?.metadata,
		publicationDate: o.publication_date,
	}));
}

async function fetchWithAbstract(q: string, count: number, tokens: number) {
	const query = `${askOaBaseUrl},${q}&per-page=${count}`;

	const begin = Time.now();
	try {
		const response = await fetchJson<OpenAlexWorksSearchResult>(query);

		// TODO: Move to share transform function
		return response.results.map((paper) => {
			// Remove the abstract_inverted_index and relevance_score from the response
			const { abstract_inverted_index, relevance_score, ...rest } = paper;

			return {
				...rest,
				abstract: fromInvertedIndex(abstract_inverted_index, tokens),
			} as OpenAlexPaperWithAbstract;
		});
	} finally {
		Time.log(begin, `[fetchWithAbstract] ${query}`);
		Metrics.elapsedSince(begin, "ask.papers.fetch");
	}
}
