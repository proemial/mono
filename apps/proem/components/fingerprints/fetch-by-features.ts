import {
	OpenAlexMeta,
	OpenAlexPaper,
	oaBaseArgs,
	oaBaseUrl,
} from "@proemial/models/open-alex";
import dayjs from "dayjs";
import { FeatureType, RankedFeature, getFeatures } from "./features";
import { fetchWithAbstract } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { getFingerprint } from "./fingerprints";
import { unstable_cache } from "next/cache";

const PER_PAGE = 50;
const MAX_PAGES = 10;
const MAX_PAPERS = 100;
const ONE_HOUR = 60 * 60;

export const fetchAndRerankPapers = async (
	{ features, days }: { features?: RankedFeature[]; days?: number },
	{ limit, offset }: { limit?: number; offset?: number } = {},
): Promise<{ meta: OpenAlexMeta; papers: RankedPaper[] }> => {
	const pageLimit = limit ?? 25;
	const pageOffset = offset ?? 1;

	const getCachedPapers = unstable_cache(
		async (f, d) => {
			const allPapers = await fetchAllPapers(d, f);
			const papers = rerankAndLimit(allPapers.papers, f);

			console.log(
				"Fetched papers",
				papers.length,
				"of",
				allPapers.papers.length,
			);
			return {
				meta: allPapers.meta,
				papers,
			};
		},
		["cachedPapers", `${features?.map((f) => f.id).join("|")}`, `${days}`],
		{ revalidate: ONE_HOUR },
	);

	const cached = await getCachedPapers(features ?? [], days);
	console.log("Cached papers", cached.papers.length, "of", cached.meta.count);

	return {
		...cached,
		papers: cached.papers.slice(pageOffset, pageOffset + pageLimit),
	};
};

export type RankedPaper = {
	paper: OpenAlexPaper;
	features: RankedPaperFeature[];
	filterMatchScore: number;
};

export type RankedPaperFeature = {
	id: string;
	label: string;
	featureMatchScore: number;
	type: FeatureType;
	irrelevant?: boolean;
};

function rerankAndLimit(
	papers: OpenAlexPaper[],
	filter: RankedFeature[],
): RankedPaper[] {
	const ranked = papers
		.filter(withTopics) // Filter out papers without topics
		.map(shortenId)
		.map((paper) => rankFeature(paper, filter));

	return ranked
		.sort((a, b) => b.filterMatchScore - a.filterMatchScore)
		.slice(0, MAX_PAPERS);
}

function rankFeature(paper: OpenAlexPaper, filter: RankedFeature[]) {
	const features = getFeatures(getFingerprint(paper))
		.map((feature) => {
			const filterScore =
				filter.find((f) => f.id === feature.id)?.coOccurrenceScore ?? 0;
			const featureMatchScore = filterScore * feature.score;

			return {
				...feature,
				featureMatchScore,
				irrelevant: featureMatchScore < 0.1,
			};
		})
		.sort((a, b) => b.featureMatchScore - a.featureMatchScore);

	const filterMatchScore = features
		.filter((f) => !f.irrelevant)
		.reduce((acc, f) => acc + f.featureMatchScore, 0);

	return { paper, features, filterMatchScore };
}

function shortenId(paper: OpenAlexPaper) {
	return {
		...paper,
		id: paper.data.id.replace("https://openalex.org/", ""),
	};
}

function withTopics(paper: OpenAlexPaper) {
	return !!paper.data.topics?.length;
}

async function fetchAllPapers(days: number, rankedFeatures?: RankedFeature[]) {
	const today = dayjs().format("YYYY-MM-DD");
	const from = dayjs(today)
		.subtract(days + 1, "day")
		.format("YYYY-MM-DD");
	const filter = getOpenAlexFilter(rankedFeatures);

	const oaFilter = [
		"type:types/preprint|types/article",
		"has_abstract:true",
		`from_created_date:${from}`,
		`publication_date:>${from}`, // We do not want old papers that were added recently
		`publication_date:<${today}`, // We do not want papers published in the future
		"language:en",
		"open_access.is_oa:true",
		"type:types/preprint|types/article",
		filter ? filter : undefined,
	]
		.filter((f) => !!f)
		.join(",");

	const url = `${oaBaseUrl}?${oaBaseArgs}&filter=${oaFilter}`;

	const paginate = `&per_page=${PER_PAGE}&page=`;
	const page1 = await fetchWithAbstract(`${url}${paginate}${1}`);
	const allPagesCount = Math.ceil(page1.meta.count / PER_PAGE) - 1;
	const pageCount = !rankedFeatures?.length
		? 1
		: allPagesCount < MAX_PAGES - 1
			? allPagesCount
			: MAX_PAGES - 1;

	const queries = await Promise.all(
		Array.from({ length: pageCount }).map((_, i) => {
			return fetchWithAbstract(`${url}${paginate}${i + 2}`);
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
		.map((item) => item.id.split("/").at(-1))
		.join("|");
	if (topics.length) selectors.push(`primary_topic.id:${topics}`);

	const concepts = rankedFeatures
		.filter((item) => item.type === "concept")
		.map((item) => item.id.split("/").at(-1))
		.join("|");
	if (concepts.length) selectors.push(`concepts.id:${concepts}`);

	if (includeKeywords) {
		const keywords = rankedFeatures
			.filter((item) => item.type === "keyword")
			.map((item) => item.id.split("/").at(-1))
			.join("|");
		if (keywords.length) selectors.push(`keywords.id:${keywords}`);
	}

	return selectors.join(",");
}
