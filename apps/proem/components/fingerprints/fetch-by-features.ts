import {
	OpenAlexMeta,
	OpenAlexPaper,
	oaBaseArgs,
	oaBaseUrl,
} from "@proemial/models/open-alex";
import dayjs from "dayjs";
import { Feature, FeatureType, RankedFeature, getFeatures } from "./features";
import { fetchWithAbstract } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { getFingerprint } from "./fingerprints";

const PER_PAGE = 50;
const MAX_PAGES = 6;

export const fetchAndRerankPapers = async (
	{ filter, days }: { filter: RankedFeature[]; days: number },
	{ limit, offset }: { limit?: number; offset?: number } = {},
): Promise<{ meta: OpenAlexMeta; papers: RankedPaper[] }> => {
	const pageLimit = limit ?? 25;
	const pageOffset = offset ?? 1;

	const allPapers = await fetchAllPapers(days, filter);

	return {
		meta: allPapers.meta,
		papers: rerankAndLimit(allPapers.papers, filter).slice(
			pageOffset,
			pageOffset + pageLimit,
		),
	};
};

export type RankedPaper = {
	paper: OpenAlexPaper;
	features: {
		id: string;
		label: string;
		featureMatchScore: number;
		type: FeatureType;
		irrelevant?: boolean;
	}[];
	filterMatchScore: number;
};

function rerankAndLimit(
	papers: OpenAlexPaper[],
	filter: RankedFeature[],
): RankedPaper[] {
	const ranked = papers
		.filter(withTopics) // Filter out papers without topics
		.map(shortenId)
		.map((paper) => rankFeature(paper, filter));

	return ranked.sort((a, b) => b.filterMatchScore - a.filterMatchScore);
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
	const deduped = papers.filter(
		(v, i, a) => a.findIndex((t) => t.data.id === v.data.id) === i,
	);
	console.log("Deduped papers", deduped.length);

	return {
		meta: page1.meta as OpenAlexMeta,
		papers: deduped,
	};
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
