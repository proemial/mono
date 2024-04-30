import { Header2, Paragraph } from "@proemial/shadcn-ui";
import { summarise } from "@/app/prompts/summarise-title";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import Markdown from "./markdown";
import { fetchPaper } from "./fetch-paper";

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

		return <OutPut headline={title} />;
	}

	return <OutPut headline={generatedTitle as string} />;
}

function OutPut({ headline, text }: { headline: string; text?: string }) {
	return (
		<>
			<Header2>
				<Markdown>{headline}</Markdown>
			</Header2>
			{text && <Paragraph>{text}</Paragraph>}
		</>
	);
}
