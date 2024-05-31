"use server";

import { summarise } from "@/app/prompts/summarise-title";
import {
	OpenAlexMeta,
	OpenAlexPaper,
	oaBaseArgs,
	oaBaseUrl,
} from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import dayjs from "dayjs";
import { fetchWithAbstract } from "../../../paper/oa/[id]/fetch-paper";
import { RankedFeature } from "../helpers/fingerprint";

type FetchFeedParams = Required<Parameters<typeof fetchAndRerankPapers>>;

export async function fetchFeed(
	params: FetchFeedParams[0],
	options: Omit<FetchFeedParams[1], "limit">,
) {
	const nextOffset = (options?.offset ?? 1) + 1;
	const { meta, papers } = await fetchAndRerankPapers(params, {
		...options,
		limit: 5,
	});

	if (!papers.length) {
		throw new Error("No papers found.");
	}

	const cachedPapers = await Redis.papers.getAll(
		papers.map((paper) => paper?.id).filter(Boolean),
	);

	const cachedPapersIds = cachedPapers
		.map((cachedPaper) =>
			// we only consider a cachedPaper valid if it has a generated title
			cachedPaper?.generated?.title ? cachedPaper?.id : null,
		)
		.filter(Boolean);

	const cacheMisses = papers.filter(
		(paper) => !cachedPapersIds.includes(paper.id),
	);

	if (cacheMisses.length === 0) {
		return {
			count: meta.count,
			rows: cachedPapers,
			nextOffset,
		};
	}

	const enhancedPapers = await Promise.all(
		papers.map(async (paper) => {
			const paperTitle = paper?.data?.title;
			const abstract = paper?.data?.abstract;
			const generatedTitle = paper?.generated?.title;

			if (!generatedTitle && paperTitle && abstract) {
				const title = (await summarise(paperTitle, abstract)) as string;
				const generated = paper.generated
					? { ...paper.generated, title }
					: { title };

				return {
					...paper,
					generated,
				};
			}
		}),
	);

	await Redis.papers.upsertAll(enhancedPapers as OpenAlexPaper[]);

	return {
		count: meta.count,
		rows: enhancedPapers,
		nextOffset,
	};
}

export const fetchAndRerankPapers = async (
	{ rankedFeatures }: { rankedFeatures?: RankedFeature[] } = {},
	{ limit, offset }: { limit?: number; offset?: number } = {},
): Promise<{ meta: OpenAlexMeta; papers: OpenAlexPaper[] }> => {
	const pageLimit = limit ?? 25;
	const pageOffset = offset ?? 1;
	const today = dayjs().format("YYYY-MM-DD");
	const twoWeeksAgo = dayjs(today).subtract(2, "week").format("YYYY-MM-DD");

	const filter = getOpenAlexFilter(rankedFeatures);

	const oaFilter = [
		"type:types/preprint|types/article",
		"has_abstract:true",
		`from_created_date:${twoWeeksAgo}`,
		`publication_date:>${twoWeeksAgo}`, // We do not want old papers that were added recently
		`publication_date:<${today}`, // We do not want papers published in the future
		"language:en",
		"open_access.is_oa:true",
		"type:types/preprint|types/article,publication_date:%3C2024-05-28,publication_date:%3E2024-05-21",
		filter ? filter : undefined,
	]
		.filter((f) => !!f)
		.join(",");
	const sort = "from_publication_date:desc,type:desc";
	const url = `${oaBaseUrl}?${oaBaseArgs}&filter=${oaFilter}&sort=${sort}&per_page=${pageLimit}&page=${pageOffset}`;

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

function getOpenAlexFilter(rankedFeatures: RankedFeature[] = []) {
	const topics = rankedFeatures
		.filter((item) => item.type === "topic")
		.map((item) => item.id.split("/").at(-1))
		.join("|");
	const concepts = rankedFeatures
		.filter((item) => item.type === "concept")
		.map((item) => item.id.split("/").at(-1))
		.join("|");

	return `primary_topic.id:${topics},concepts.id:${concepts}`;
}

const sortByPublicationDateDesc = (a: OpenAlexPaper, b: OpenAlexPaper) =>
	b.data.publication_date.localeCompare(a.data.publication_date);
