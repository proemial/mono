"use server";
import {
	OpenAlexWorkMetadata,
	oaBaseArgs,
	oaBaseUrl,
} from "@proemial/repositories/oa/models/oa-paper";
import dayjs from "dayjs";

type Result = { results: OpenAlexWorkMetadata[] };
export type OptionalResult = Result | undefined;

export async function findPapersAction(
	prev: OptionalResult,
	form: FormData,
): Promise<OptionalResult> {
	const query = form.get("query") as string;
	if (!query?.length) {
		return undefined;
	}

	return await findPapers(query);
}

async function findPapers(query: string) {
	const today = dayjs().format("YYYY-MM-DD");
	const oaFilter = [
		"type:types/preprint|types/article",
		"has_abstract:true",
		`publication_date:<${today}`, // We do not want papers published in the future
		"language:en",
		"open_access.is_oa:true",
	]
		.filter((f) => !!f)
		.join(",");

	const byDoi = await findByDoi(query, oaFilter);
	const byTitle = await findByTitle(query, oaFilter);

	const papers = [...byDoi.results, ...byTitle.results];

	return {
		results: papers.map((paper) => ({
			...paper,
			id: paper.id.split("/").at(-1) as string,
		})),
	};
}

async function findByDoi(query: string, baseFilter: string): Promise<Result> {
	// This regexp doesn't support doi as url: https://doi.org/10.1111/1475-6773.14324
	// if (!query.match(/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i)) {
	// 	return { results: [] };
	// }

	const byDoi = await fetch(
		`${oaBaseUrl}?${oaBaseArgs}&filter=${baseFilter},doi:${query}`,
	);
	return (await byDoi.json()) as Result;
}

async function findByTitle(query: string, baseFilter: string): Promise<Result> {
	const byTitle = await fetch(
		`${oaBaseUrl}?${oaBaseArgs}&filter=${baseFilter},title.search:${query}`,
	);
	return (await byTitle.json()) as Result;
}
