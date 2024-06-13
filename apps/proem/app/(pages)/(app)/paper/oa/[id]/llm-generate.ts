import { generateStarters } from "@/app/prompts/starters";
import { summarise } from "@/app/prompts/summarise-title";
import { OpenAlexPaper } from "@proemial/papers/oa/models/oa-paper";
import { Prefix } from "@proemial/redis/adapters/papers";
import { Redis } from "@proemial/redis/redis";

export async function generate(paper: OpenAlexPaper, prefix = "oa") {
	const paperTitle = paper?.data?.title;
	const abstract = paper?.data?.abstract;

	if (paperTitle && abstract) {
		const starters = !paper.generated?.starters
			? await generateStarters(paperTitle, abstract)
			: paper.generated.starters;
		const title = !paper.generated?.title
			? ((await summarise(paperTitle, abstract)) as string)
			: paper.generated.title;

		const updatedPaper = await Redis.papers.upsert(
			paper.id,
			(existingPaper) => {
				const generated = existingPaper.generated
					? { ...existingPaper.generated, starters, title }
					: { starters, title };

				return {
					...existingPaper,
					generated,
				};
			},
			prefix as Prefix,
		);

		return updatedPaper;
	}
	return paper;
}
