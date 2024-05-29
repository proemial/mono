import {
	OpenAlexMeta,
	OpenAlexPaper,
	OpenAlexWorkMetadata,
	OpenAlexWorksSearchResult,
	oaBaseArgs,
	oaBaseUrl,
	openAlexFields,
} from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { fetchJson } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";
import dayjs from "dayjs";
import { cache } from "react";
import { TreeFilterHelpers } from "../../../discover/topics/tree-filter-helpers";

export const fetchPaper = cache(
	async (id: string): Promise<OpenAlexPaper | null> => {
		const paper = await Redis.papers.get(id);

		if (
			!(paper?.data as OpenAlexWorkMetadata)?.doi ||
			!(paper?.data as OpenAlexWorkMetadata)?.topics
		) {
			console.log("[fetchPaper] Fetch", id);
			const oaPaper = await fetch(
				`${oaBaseUrl}/${id}?${oaBaseArgs}&select=${openAlexFields.all}`,
			);
			if (!oaPaper.ok) {
				console.error(
					`Failed to fetch paper ${id} from OpenAlex (${oaPaper.status}: ${oaPaper.statusText})`,
				);
				return null;
			}
			const oaPaperJson = (await oaPaper.json()) as OpenAlexWorkMetadata;

			const data = {
				...oaPaperJson,
				abstract: fromInvertedIndex(oaPaperJson.abstract_inverted_index, 350),
			};

			console.log("[fetchPaper] Upsert", id);
			return await Redis.papers.upsert(id, (existingPaper) => {
				return {
					...existingPaper,
					data,
					id,
				};
			});
		}
		return paper;
	},
);

export async function splitAndFetch(
	{ field, filter }: { field?: number; filter?: string } = {},
	{ limit, offset }: { limit?: number; offset?: number } = {},
): Promise<{ meta: OpenAlexMeta; papers: OpenAlexPaper[] }> {
	if (!filter) {
		return fetchPapersByField({ field, filter }, { limit, offset });
	}

	const { filters } = TreeFilterHelpers.toOaFilters(filter);
	const results = await Promise.all(
		filters.map((f) =>
			fetchPapersByField({ field, filter: f }, { limit, offset }),
		),
	);
	const reduced = results.reduce((acc, { meta, papers }) => {
		return {
			meta: {
				count: acc.meta.count + meta.count,
				page: meta.page,
				per_page: meta.per_page,
			},
			papers: [...acc.papers, ...papers],
		};
	});

	return reduced;
}

export const fetchPapersByField = async (
	{ field, filter }: { field?: number; filter?: string } = {},
	{ limit, offset }: { limit?: number; offset?: number } = {},
): Promise<{ meta: OpenAlexMeta; papers: OpenAlexPaper[] }> => {
	const pageLimit = limit ?? 25;
	const pageOffset = offset ?? 1;
	const today = dayjs().format("YYYY-MM-DD");
	const twoWeeksAgo = dayjs(today).subtract(2, "week").format("YYYY-MM-DD");
	const select = openAlexFields.all;

	const oaFilter = [
		"type:types/preprint|types/article",
		"has_abstract:true",
		`from_created_date:${twoWeeksAgo}`,
		`publication_date:>${twoWeeksAgo}`, // We do not want old papers that were added recently
		`publication_date:<${today}`, // We do not want papers published in the future
		"language:en",
		"open_access.is_oa:true",
		field ? `primary_topic.field.id:${field}` : undefined,
		filter ? filter : undefined,
	]
		.filter((f) => !!f)
		.join(",");
	const sort = "from_publication_date:desc,type:desc";
	const url = `${oaBaseUrl}?${oaBaseArgs}&select=${select}&filter=${oaFilter}&sort=${sort}&per_page=${pageLimit}&page=${pageOffset}`;

	const { meta, papers } = await fetchWithAbstract(url);

	if (meta.count === 0) {
		return { meta, papers };
	}

	const oaPapers = papers
		.filter((p) => p.data.topics?.length)
		.map((result) => ({
			...result,
			id: result.data.id.replace("https://openalex.org/", ""),
		}));

	return { meta, papers: [...oaPapers].sort(sortByPublicationDateDesc) };
};

const sortByPublicationDateDesc = (a: OpenAlexPaper, b: OpenAlexPaper) =>
	b.data.publication_date.localeCompare(a.data.publication_date);

async function fetchWithAbstract(url: string) {
	const { meta, results } = await fetchJson<OpenAlexWorksSearchResult>(url);

	const papers = results.map((paper) => {
		// Remove the abstract_inverted_index and relevance_score from the response
		const { abstract_inverted_index, relevance_score, ...rest } = paper;

		return {
			data: {
				...rest,
				abstract: fromInvertedIndex(abstract_inverted_index, 350),
			},
		} as OpenAlexPaper;
	});

	return { meta, papers };
}
