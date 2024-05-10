"use server";

import { summarise } from "@/app/prompts/summarise-title";
import { Redis } from "@proemial/redis/redis";
import { Paragraph } from "@proemial/shadcn-ui";
import { fetchPaper } from "./fetch-paper";
import Markdown from "./markdown";

export async function fetchSummary<
	TPaper extends {
		id: string;
		data?: { title: string; abstract: string } | undefined;
		generated?: { title: string } | undefined;
	},
>(options: {
	id?: string;
	paper?: TPaper;
}) {
	if (!options.id && !options.paper) throw new Error("No id or paper provided");
	const paper = options.paper ?? (await fetchPaper(options.id as string));

	const paperTitle = paper?.data?.title;
	const abstract = paper?.data?.abstract;
	const generatedTitle = paper?.generated?.title;

	if (!generatedTitle && paperTitle && abstract) {
		const title = (await summarise(paperTitle, abstract)) as string;

		console.log("[summary] Upsert", paper.id);
		await Redis.papers.upsert(paper.id, (existingPaper) => {
			const generated = existingPaper.generated
				? { ...existingPaper.generated, title }
				: { title };

			return {
				...existingPaper,
				generated,
			};
		});

		return title;
	}

	return generatedTitle as string;
}
