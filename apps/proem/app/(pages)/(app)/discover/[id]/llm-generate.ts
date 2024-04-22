import { generateStarters } from "@/app/prompts/starters";
import { summarise } from "@/app/prompts/summariser";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";

export async function generate(paper: OpenAlexPaper) {
	const paperTitle = paper?.data?.title;
	const abstract = paper?.data?.abstract;

	if (paperTitle && abstract) {
		const starters = !paper.generated?.starters
			? await generateStarters(paperTitle, abstract)
			: paper.generated?.starters;
		const title = !paper.generated?.title
			? ((await summarise(paperTitle, abstract)) as string)
			: paper.generated?.title;

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
		);

		return updatedPaper;
	}
	return paper;
}
