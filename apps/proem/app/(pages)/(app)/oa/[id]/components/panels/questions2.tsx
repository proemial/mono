import { generateStarters } from "@/app/prompts/starters";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { PaperChat2 } from "./chat/paper-chat2";
import { ReactNode } from "react";

export async function QuestionsPanel2({ paper }: { paper?: OpenAlexPaper }) {
	if (!paper) return [null, null, null];

	const starters = paper.generated?.starters
		? paper.generated?.starters
		: await generate(paper);

	return PaperChat2({ paper, starters }) as [ReactNode, ReactNode, ReactNode];
}

async function generate(paper: OpenAlexPaper) {
	const paperTitle = paper?.data?.title;
	const abstract = paper?.data?.abstract;

	if (paperTitle && abstract) {
		const starters = await generateStarters(paperTitle, abstract);

		await Redis.papers.upsert(paper.id, (existingPaper) => {
			const generated = existingPaper.generated
				? { ...existingPaper.generated, starters }
				: { starters };

			return {
				...existingPaper,
				generated,
			};
		});

		return starters;
	}
	return [];
}
