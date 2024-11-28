import {
	fetchPaper,
	fetchPapers,
} from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { summariseTitle } from "@proemial/adapters/llm/prompts/microtitle";
import { Redis } from "@proemial/adapters/redis";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { SourceProduct } from "@proemial/adapters/llm/models";

export const fromIds = async (ids: string[], source?: SourceProduct) => {
	const cachedPapers = await Redis.papers.getAll(ids);

	const cachedPapersIds = cachedPapers
		.map((cachedPaper) =>
			// we only consider a cachedPaper valid if it has a generated title
			cachedPaper?.generated?.title ? cachedPaper?.id : null,
		)
		.filter(Boolean);

	const cacheMisses = ids.filter((id) => !cachedPapersIds.includes(id));

	if (cacheMisses.length === 0) {
		return cachedPapers;
	}

	const enhanced = [] as OpenAlexPaper[];
	const missedPapers = (await fetchPapers(cacheMisses))?.filter(
		(p) => !!p.data.abstract,
	);

	if (missedPapers) {
		await Promise.all(
			missedPapers.map(async (currentPaper) => {
				const paperTitle = currentPaper?.data.title;
				const abstract = currentPaper?.data.abstract as string;

				console.log("Enhancing paper", currentPaper.id);
				const title = (await summariseTitle(
					paperTitle,
					abstract,
					source,
					true,
				)) as string;
				const generated = { title };

				enhanced.push({
					...currentPaper,
					generated,
				});
			}),
		);
		if (enhanced.length > 0) {
			await Redis.papers.upsertAll(enhanced);
		}
	}

	return [...cachedPapers, ...enhanced];
};
