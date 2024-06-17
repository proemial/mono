import { fetchWithAbstract } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { RankedFeature } from "@proemial/repositories/oa/fingerprinting/features";
import {
	RankedPaper,
	rerankAndLimit,
} from "@proemial/repositories/oa/fingerprinting/rerank";
import {
	OpenAlexMeta,
	OpenAlexPaper,
	oaBaseArgs,
	oaBaseUrl,
} from "@proemial/repositories/oa/models/oa-paper";
import dayjs from "dayjs";
import { unstable_cache } from "next/cache";

// Default number of days to fetch papers for
export const FEED_DEFAULT_DAYS = 14;

// OpenAlex has a limit of 100 features in a query
const MAX_FEATURES_IN_QUERY = 100;

// No. of papers pr. page
const PER_PAGE = 50;

// Max number of pages to fetch
const MAX_PAGES = 10;

// Cache feed papers for 1 hour
const CACHE_FOR = 60 * 60; // 1 hour

export const fetchAndRerankPapers = async (
	{ features, days }: { features?: RankedFeature[]; days?: number },
	{ limit, offset }: { limit?: number; offset?: number } = {},
	nocache?: boolean,
): Promise<{ meta: OpenAlexMeta; papers: RankedPaper[] }> => {
	const pageLimit = limit ?? 25;
	const pageOffset = offset ?? 1;

	const cacheWorker = async (f: RankedFeature[], d: number) => {
		const allPapers = await fetchAllPapers(d, f);
		const papers = rerankAndLimit(allPapers.papers, f);

		console.log("Fetched papers", papers.length, "of", allPapers.papers.length);
		return {
			meta: allPapers.meta,
			papers,
		};
	};

	const getCachedPapers = unstable_cache(
		cacheWorker,
		["cachedPapers", `${features?.map((f) => f.id).join("|")}`, `${days}`],
		{ revalidate: CACHE_FOR },
	);

	const cached = nocache
		? await cacheWorker(features ?? [], days ?? FEED_DEFAULT_DAYS)
		: await getCachedPapers(features ?? [], days ?? FEED_DEFAULT_DAYS);

	if (nocache) {
		console.log("Cached papers", cached.papers.length, "of", cached.meta.count);
	}

	return {
		...cached,
		papers: cached.papers.slice(pageOffset, pageOffset + pageLimit),
	};
};

async function fetchAllPapers(days: number, rankedFeatures?: RankedFeature[]) {
	const constrainedFilter = getOpenAlexFilter(rankedFeatures, true);
	const { papers, meta } = await getAllFor(constrainedFilter, days, MAX_PAGES);

	const pageCount = Math.ceil(meta.count / PER_PAGE);
	if (pageCount < MAX_PAGES) {
		const lessConstrainedFilter = getOpenAlexFilter(rankedFeatures, false);
		const { papers: morePapers, meta: moreMeta } = await getAllFor(
			lessConstrainedFilter,
			days,
			MAX_PAGES - pageCount,
		);
		console.log(
			"found",
			meta.count,
			"constrained matching papers, and",
			moreMeta.count,
			"less constrained matching papers.",
		);

		const count = meta.count + moreMeta.count;

		return {
			meta: {
				count,
				page: 1,
				per_page: PER_PAGE * MAX_PAGES,
			},
			papers: merge(papers, morePapers),
		};
	}
	console.log("Identified", meta.count, "constrained matching papers");

	return { meta, papers };
}

function merge(papers: OpenAlexPaper[], morePapers: OpenAlexPaper[]) {
	const deDuped = morePapers.filter(
		(p) => !papers.find((mp) => mp.data.id === p.data.id),
	);
	return [...papers, ...deDuped];
}

async function getAllFor(filter: string, days: number, maxPages: number) {
	const today = dayjs().format("YYYY-MM-DD");
	const from = dayjs(today)
		.subtract(days + 1, "day")
		.format("YYYY-MM-DD");

	const oaFilter = [
		"type:types/preprint|types/article",
		"has_abstract:true",
		`from_created_date:${from}`,
		`publication_date:>${from}`, // We do not want old papers that were added recently
		`publication_date:<${today}`, // We do not want papers published in the future
		"language:en",
		"open_access.is_oa:true",
		"type:types/preprint|types/article",
	]
		.filter((f) => !!f)
		.join(",");

	const baseUrl = `${oaBaseUrl}?${oaBaseArgs}&filter=${oaFilter},`;
	const paginate = `&per_page=${PER_PAGE}&page=`;

	const httpMax = 2048;
	const maxSelectorLength = httpMax - baseUrl.length - paginate.length + 2; // the 2 chars represents the page number
	let selector = filter;
	if (filter.length > maxSelectorLength) {
		const limited = filter.substring(0, maxSelectorLength);
		selector = limited.substring(0, limited.lastIndexOf("|"));
	}

	const page1 = await fetchWithAbstract(`${baseUrl}${selector}${paginate}${1}`);
	const allPagesCount = Math.ceil(page1.meta.count / PER_PAGE) - 1;
	const pageCount = allPagesCount < maxPages - 1 ? allPagesCount : maxPages - 1;

	const queries = await Promise.all(
		Array.from({ length: pageCount }).map((_, i) => {
			return fetchWithAbstract(`${baseUrl}${selector}${paginate}${i + 2}`);
		}),
	);

	const papers = [page1, ...queries].flatMap((q) => q.papers);

	return {
		meta: page1.meta as OpenAlexMeta,
		papers,
	};
}

function getOpenAlexFilter(
	rankedFeatures: RankedFeature[] = [],
	includeKeywords?: boolean,
) {
	if (!rankedFeatures.length) {
		return "";
	}

	const selectors = [];
	const topics = rankedFeatures
		.filter((item) => item.type === "topic")
		.slice(0, MAX_FEATURES_IN_QUERY)
		.map((item) => item.id.split("/").at(-1));
	if (topics.length) selectors.push(`topics.id:${topics.join("|")}`);

	if (includeKeywords) {
		const keywords = rankedFeatures
			.filter((item) => item.type === "keyword")
			.slice(0, MAX_FEATURES_IN_QUERY)
			.map((item) => item.id.split("/").at(-1))
			.map((keyword) => encodeURIComponent(keyword as string));
		if (keywords.length) selectors.push(`keywords.id:${keywords.join("|")}`);
	}

	const concepts = rankedFeatures
		.filter((item) => item.type === "concept")
		.slice(0, MAX_FEATURES_IN_QUERY)
		.map((item) => item.id.split("/").at(-1));
	if (concepts.length) selectors.push(`concepts.id:${concepts.join("|")}`);

	return selectors.join(",");
}
