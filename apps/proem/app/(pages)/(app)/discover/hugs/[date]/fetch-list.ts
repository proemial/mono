"use server";

import { fetchPapers } from "@/app/api/paper-search/search";
import { Redis } from "@proemial/redis/redis";
import { fetchPaper } from "../../../paper/oa/[id]/fetch-paper";
import { summarise } from "@/app/prompts/summarise-title";
import { generate } from "../../../paper/oa/[id]/llm-generate";

type DailyPaper = {
	paper: {
		id: string;
	};
};

export async function fetchReadingList(date: string) {
	const hfResponse = await fetch(
		`https://huggingface.co/api/daily_papers?date=${date}`,
	);
	const hfPapers = (await hfResponse.json()) as DailyPaper[];
	const arxivIds = hfPapers.map((entry) => entry.paper.id);

	const oaResponses = await Promise.all(
		arxivIds.map((id) =>
			fetch(
				`https://api.openalex.org/works?filter=locations.landing_page_url:http://arxiv.org/abs/${id}|https://arxiv.org/abs/${id}&select=id`,
			),
		),
	);
	const oaObjects = (
		await Promise.all(oaResponses.map((res) => res.json()))
	).filter((res) => res.meta.count);
	const oaIds = oaObjects.map((o) => o.results[0].id.split("/").at(-1));

	if (!oaIds.length) {
		return { rows: [] };
	}

	for (const id of oaIds) {
		const paper = await fetchPaper(id);
		if (paper && !paper.generated) {
			await generate(paper);
			await waitfor(500);
		}
	}

	const cachedPapers = await Redis.papers.getAll(oaIds);

	const cachedPapersIds = cachedPapers
		.map((cachedPaper) =>
			// we only consider a cachedPaper valid if it has a generated title
			cachedPaper?.generated?.title ? cachedPaper?.id : null,
		)
		.filter(Boolean);

	const cacheMisses = arxivIds.filter(
		(paperId) => !cachedPapersIds.includes(paperId),
	);

	return { rows: cachedPapers };
}

function waitfor(millis: number) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve("");
		}, millis);
	});
}
