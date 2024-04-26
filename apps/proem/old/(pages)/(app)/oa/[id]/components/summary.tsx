import { summarise } from "@/app/prompts/summarise-title";
import { fetchPaper } from "@/old/(pages)/(app)/oa/[id]/fetch-paper";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import Markdown from "./markdown";

export default async function Summary(options: {
	id?: string;
	paper?: OpenAlexPaper;
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

		return <Markdown>{title as string}</Markdown>;
	}

	return <Markdown>{generatedTitle as string}</Markdown>;
}
