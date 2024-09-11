import { OpenAlexPaper } from "../models/oa-paper";
import { bucketSort } from "./bucket-sort";
import { FeatureType, RankedFeature, getFeatures } from "./features";
import { getFingerprint } from "./fingerprints";

export type RankedPaperFeature = {
	id: string;
	label: string;
	featureMatchScore: number;
	type: FeatureType;
	irrelevant?: boolean;
};

export type RankedPaper = {
	paper: OpenAlexPaper;
	features: RankedPaperFeature[];
	filterMatchScore: number;
};

export type RankedPaperId = {
	id: string;
	createdAt: string;
	publishedAt: string;
	features: RankedPaperFeature[];
	filterMatchScore: number;
};

export function rerankAndLimit(
	papers: OpenAlexPaper[],
	filter: RankedFeature[],
): RankedPaperId[] {
	const ranked = papers
		.filter(withTopics) // Filter out papers without topics
		.map(shortenId)
		.map((paper) => rankFeature(paper, filter));

	return sort(ranked).map(
		(p) =>
			({
				filterMatchScore: p.filterMatchScore,
				features: p.features,
				id: p.paper.id,
				createdAt: p.paper.data.created_date,
				publishedAt: p.paper.data.publication_date,
			}) as RankedPaperId,
	);
}

function sort(papers: RankedPaper[]) {
	const sorted = papers.sort((a, b) => b.filterMatchScore - a.filterMatchScore);

	return bucketSort(sorted);
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
				irrelevant: !featureMatchScore,
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
