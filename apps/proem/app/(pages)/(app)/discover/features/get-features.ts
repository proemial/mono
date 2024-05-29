"use server";
import { getPaperId } from "@/utils/oa-paper";
import { fetchPaper } from "../../paper/oa/[id]/fetch-paper";
import {
	OpenAlexConcept,
	OpenAlexKeyword,
	OpenAlexTopic,
} from "@proemial/models/open-alex";

export type FeatureSet = {
	id: string;
	topics: OpenAlexTopic[];
	concepts: OpenAlexConcept[];
	keywords: OpenAlexKeyword[];
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function getPaperFeatures(prev: any, formData: any) {
	const identifiers = formData.get("identifier").split(",");
	return await Promise.all(identifiers.map(getFeaturesForPaper));
}

async function getFeaturesForPaper(identifier: string) {
	const paperId = await getPaperId(identifier);

	if (!paperId) {
		return undefined;
	}

	const paper = await fetchPaper(paperId);
	console.log(paper?.data.keywords);

	return {
		id: paperId,
		topics: paper?.data.topics,
		concepts: paper?.data.concepts,
		keywords: paper?.data.keywords,
	} as FeatureSet;
}
