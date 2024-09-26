import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { summarise } from "@/app/prompts/summarise-title";
import { Redis } from "@proemial/redis/redis";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";

export const fromIds = async (ids: string[]) => {
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
	await Promise.all(
		cacheMisses.map(async (id) => {
			const currentPaper = await fetchPaper(id);
			if (!currentPaper) {
				console.log("Paper not found", id);
				return;
			}
			if (!currentPaper.data.abstract_inverted_index) {
				console.log("Paper has no abstract", id);
				return;
			}
			const paperTitle = currentPaper?.data?.title;
			const abstract = currentPaper?.data?.abstract;
			const generatedTitle = currentPaper?.generated?.title;

			if (!generatedTitle && paperTitle && abstract) {
				console.log("Enhancing paper", currentPaper.id);
				const title = (await summarise(paperTitle, abstract)) as string;
				const generated = currentPaper.generated
					? { ...currentPaper.generated, title }
					: { title };

				enhanced.push({ ...currentPaper, generated });
			}
		}),
	);

	await Redis.papers.upsertAll(enhanced);

	return [...cachedPapers, ...enhanced];
};
