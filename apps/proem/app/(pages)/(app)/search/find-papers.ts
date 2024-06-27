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

	const search = await fetch(
		`${oaBaseUrl}?${oaBaseArgs}&filter=${oaFilter},title.search:${query}`,
	);
	console.log(
		`${oaBaseUrl}?${oaBaseArgs}&filter=${oaFilter},title.search:${query}`,
	);

	const papers = (await search.json()) as Result;

	return {
		results: papers.results.map((paper) => ({
			...paper,
			id: paper.id.split("/").at(-1) as string,
		})),
	};
}
