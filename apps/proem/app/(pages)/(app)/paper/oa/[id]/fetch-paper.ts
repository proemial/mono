import {
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

export const fetchPaper = cache(
	async (id: string): Promise<OpenAlexPaper | undefined> => {
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

export const fetchLatestPapers = async (
	field?: number,
): Promise<OpenAlexPaper[]> => {
	const today = dayjs().format("YYYY-MM-DD");
	const twoDaysAgo = dayjs(today).subtract(2, "day").format("YYYY-MM-DD");
	const select = openAlexFields.all;

	const filter = [
		"type:types/preprint|types/article",
		"has_abstract:true",
		`from_created_date:${twoDaysAgo}`,
		`publication_date:>${twoDaysAgo}`, // We do not want old papers that were added recently
		`publication_date:<${today}`, // We do not want papers published in the future
		"language:en",
		"open_access.is_oa:true",
		field ? `primary_topic.field.id:${field}` : undefined,
	]
		.filter((f) => !!f)
		.join(",");
	const sort = "from_created_date:desc,type:desc";
	const url = `${oaBaseUrl}?${oaBaseArgs}&select=${select}&filter=${filter}&sort=${sort}`;

	// This will include 25 papers (one pagination page), which seems appropriate
	// for a feed.
	const oaPapers = await fetchWithAbstract(url);

	const papers = (oaPapers || [])
		.filter((p) => p.data.topics?.length)
		.map((result) => ({
			...result,
			id: result.data.id.replace("https://openalex.org/", ""),
		}));

	// Overwriting all papers always is not optimal
	await Redis.papers.upsertAll(papers);

	return [...papers].sort(sortByPublicationDateDesc);
};

const sortByPublicationDateDesc = (a: OpenAlexPaper, b: OpenAlexPaper) =>
	b.data.publication_date.localeCompare(a.data.publication_date);

async function fetchWithAbstract(url: string) {
	const response = await fetchJson<OpenAlexWorksSearchResult>(url);

	return response.results.map((paper) => {
		// Remove the abstract_inverted_index and relevance_score from the response
		const { abstract_inverted_index, relevance_score, ...rest } = paper;

		return {
			data: {
				...rest,
				abstract: fromInvertedIndex(abstract_inverted_index, 350),
			},
		} as OpenAlexPaper;
	});
}
