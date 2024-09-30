import { isArxivPaperId } from "@/utils/is-arxiv-paper-id";
import { Redis } from "@proemial/redis/redis";
import {
	OpenAlexMeta,
	OpenAlexPaper,
	OpenAlexWorkMetadata,
	OpenAlexWorksSearchResult,
	oaBaseArgs,
	oaBaseUrl,
	openAlexFields,
} from "@proemial/repositories/oa/models/oa-paper";
import { fetchJson } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";
import dayjs from "dayjs";
import { cache } from "react";

export const fetchPaper = cache(
	async (id: string): Promise<OpenAlexPaper | undefined> => {
		// Filter out arxiv papers
		if (isArxivPaperId(id)) {
			return undefined;
		}

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
				return undefined;
			}
			const oaPaperJson = (await oaPaper.json()) as OpenAlexWorkMetadata;

			const data = {
				...oaPaperJson,
				abstract: fromInvertedIndex(oaPaperJson.abstract_inverted_index, 350),
			};

			console.log("[fetchPaper] Upsert", id);
			return await Redis.papers.upsert(id, (existingPaper) => {
				const updatedPaper = {
					...existingPaper,
					data,
					id,
				};
				updatedPaper.data.referenced_works =
					updatedPaper.data.referenced_works?.slice(0, 20);
				updatedPaper.data.related_works =
					updatedPaper.data.related_works?.slice(0, 20);
				return updatedPaper;
			});
		}
		return paper ?? undefined;
	},
);

export const fetchPapersByField = async (
	{ field }: { field?: number } = {},
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

		// Should have been `created_date`, but OpenAlex does not allow filtering on that field (also in fetch-by-features.ts)
		// `created_date:>${twoWeeksAgo}`, // We do not want old papers that were added recently
		// `created_date:<${today}`, // We do not want papers published in the future

		"language:en",
		"open_access.is_oa:true",
		field ? `primary_topic.field.id:${field}` : undefined,
	]
		.filter((f) => !!f)
		.join(",");
	const sort = "from_created_date:desc,type:desc";
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

	return { meta, papers: [...oaPapers] };
};

export async function fetchWithAbstract(url: string) {
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

export const fetchPapersByInstitution = async (
	{ id }: { id?: string } = {},
	{ limit, offset }: { limit?: number; offset?: number } = {},
): Promise<{ meta: OpenAlexMeta; papers: OpenAlexPaper[] }> => {
	const pageLimit = limit ?? 25;
	const pageOffset = offset ?? 1;
	const select = openAlexFields.all;
	const oaFilter = [
		"type:types/preprint|types/article",
		"has_abstract:true",
		`authorships.institutions.id:${id}`,
		"language:en",
		"open_access.is_oa:true",
	]
		.filter((f) => !!f)
		.join(",");

	const sort = "from_created_date:desc";
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
	return { meta, papers: [...oaPapers] };
};
