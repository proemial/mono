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

const PER_PAGE = 50;
const MAX_PAGES = 6;

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
				console.log("Enhancing paper", paper.id);
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
	{ filter, days }: { filter?: RankedFeature[]; days: number },
	{ limit, offset }: { limit?: number; offset?: number } = {},
): Promise<{ meta: OpenAlexMeta; papers: OpenAlexPaper[] }> => {
	const pageLimit = limit ?? 25;
	const pageOffset = offset ?? 1;

	const allPapers = await fetchAllPapers(days, filter);

	return {
		meta: allPapers.meta,
		papers: rerankAndLimit(allPapers.papers).slice(
			pageOffset,
			pageOffset + pageLimit,
		),
	};
};

function rerankAndLimit(papers: OpenAlexPaper[], filter?: RankedFeature[]) {
	const sanitised = papers
		.filter((p) => p.data.topics?.length) // Filter out papers without topics
		.map((result) => ({
			...result,
			id: result.data.id.replace("https://openalex.org/", ""),
		}));

	return sanitised; //sortBySimilarity(sanitised, filter);
}

function getOpenAlexFilter(rankedFeatures: RankedFeature[] = []) {
	if (!rankedFeatures.length) {
		return "";
	}

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

async function fetchAllPapers(days: number, rankedFeatures?: RankedFeature[]) {
	const today = dayjs().format("YYYY-MM-DD");
	const from = dayjs(today)
		.subtract(days + 1, "day")
		.format("YYYY-MM-DD");
	const filter = getOpenAlexFilter(rankedFeatures);

	console.log(days, " - Fetching papers from", from, "to", today);

	const oaFilter = [
		"type:types/preprint|types/article",
		"has_abstract:true",
		`from_created_date:${from}`,
		`publication_date:>${from}`, // We do not want old papers that were added recently
		`publication_date:<${today}`, // We do not want papers published in the future
		"language:en",
		"open_access.is_oa:true",
		"type:types/preprint|types/article,publication_date:%3C2024-05-28,publication_date:%3E2024-05-21",
		filter ? filter : undefined,
	]
		.filter((f) => !!f)
		.join(",");

	const url = `${oaBaseUrl}?${oaBaseArgs}&filter=${oaFilter}`;

	const paginate = `&per_page=${PER_PAGE}&page=`;
	console.log("Fetcing page 0");
	const page1 = await fetchWithAbstract(`${url}${paginate}${1}`);
	const allPagesCount = Math.ceil(page1.meta.count / PER_PAGE) - 1;
	const pageCount = allPagesCount < MAX_PAGES ? allPagesCount : MAX_PAGES;

	console.log(
		`Fetching ${pageCount} pages, from a total of ${allPagesCount} pages / ${page1.meta.count} papers`,
	);

	const queries = await Promise.all(
		Array.from({ length: pageCount }).map((_, i) => {
			console.log(`Fetcing page ${i + 1}`);
			return fetchWithAbstract(`${url}${paginate}${i + 1}`);
		}),
	);

	const papers = [page1, ...queries].flatMap((q) => q.papers);
	return {
		meta: page1.meta as OpenAlexMeta,
		papers,
	};
}
