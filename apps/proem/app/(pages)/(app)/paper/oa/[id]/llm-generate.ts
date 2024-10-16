import { generateStarters } from "@/app/prompts/starters";
import { summariseTitle } from "@proemial/adapters/llm/prompts/microtitle";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Prefix } from "@proemial/adapters/redis/papers";
import { Redis } from "@proemial/adapters/redis";

export async function generate(paper: OpenAlexPaper, prefix = "oa") {
	const paperTitle = paper?.data?.title;
	const abstract = paper?.data?.abstract;

	if (paperTitle && abstract) {
		const starters = !paper.generated?.starters
			? await generateStarters(paperTitle, abstract)
			: paper.generated.starters;
		const title = !paper.generated?.title
			? ((await summariseTitle(paperTitle, abstract)) as string)
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
