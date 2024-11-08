import {
	oaBaseArgs,
	oaBaseUrl,
	OpenAlexPaperWithAbstract,
	OpenAlexWorksHit,
	OpenAlexWorksSearchResult,
} from "@proemial/repositories/oa/models/oa-paper";
import { fetchJson } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";
import { Provider, QdrantPaper, QdrantPaperPayload } from "./qdrant.model";
import dayjs from "dayjs";
import { getArXivid, sanitizePaper } from "./sanitize";
import { qdrantId } from "@/data/db/qdrant";

export async function fetchFromOpenAlex(
	params: string,
	provider: Provider = "openalex",
) {
	const { meta, results } = await fetchJson<OpenAlexWorksSearchResult>(
		`${oaBaseUrl}?${oaBaseArgs}&${params}`,
		{ cache: "no-store" },
	);

	// Filter out papers that don't have a title and abstract
	const hasTitleAndAbstract = (paper: OpenAlexWorksHit) =>
		!!paper.abstract_inverted_index && !!paper.title;

	const papers = results.filter(hasTitleAndAbstract).map((paper) => {
		// Remove the abstract_inverted_index and relevance_score from the response
		const { abstract_inverted_index, relevance_score, ...rest } = paper;

		const sanitizedPaper = sanitizePaper({
			...rest,
			abstract: fromInvertedIndex(abstract_inverted_index, 350),
			provider: "openalex",
		} as QdrantPaperPayload);

		const arxivId = getArXivid(sanitizedPaper);
		return {
			id: qdrantId(arxivId ?? paper.id),
			payload: sanitizedPaper,
		} as QdrantPaper;
	});

	return { meta, papers };
}

export function updatedSinceQuery(date: string) {
	const updatedSince = dayjs(date).format("YYYY-MM-DD");

	const limit = 200;
	const timeWindowBegin = dayjs(updatedSince)
		.subtract(3, "month")
		.format("YYYY-MM-DD");
	const timeWindowEnd = updatedSince;

	// https://api.openalex.org/works?mailto=lab@proemial.ai&api_key=AuEVGBBSG9SBwo6LV8hhxh&select=created_date&filter=type:types/preprint|types/article,has_abstract:true,language:en,open_access.is_oa:true,from_publication_date:2024-10-01,to_publication_date:2024-10-08,from_updated_date:2024-10-08&per_page=200
	// type:types/preprint|types/article,has_abstract:true,language:en,open_access.is_oa:true
	const filter = [
		"type:types/preprint|types/article",
		"has_abstract:true",
		"language:en",
		"open_access.is_oa:true",
		`from_publication_date:${timeWindowBegin}`,
		`to_publication_date:${timeWindowEnd}`,
		`from_updated_date:${updatedSince}`,
	]
		.filter((f) => !!f)
		.join(",");

	return `filter=${filter}&per_page=${limit}`;
}
