import { summariseStarters } from "@/app/prompts/starters";
import { summariseTitle } from "@proemial/adapters/llm/prompts/microtitle";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Prefix } from "@proemial/adapters/redis/papers";
import { Redis } from "@proemial/adapters/redis";
import { SourceProduct } from "@proemial/adapters/llm/models";

export async function generate(
	paper: OpenAlexPaper,
	prefix = "oa",
	source?: SourceProduct,
) {
	const paperTitle = paper?.data?.title;
	const abstract = paper?.data?.abstract;

	if (paperTitle && abstract) {
		const starters = !paper.generated?.starters
			? await summariseStarters(paperTitle, abstract, source)
			: paper.generated.starters;
		const title = !paper.generated?.title
			? ((await summariseTitle(paperTitle, abstract, source)) as string)
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
