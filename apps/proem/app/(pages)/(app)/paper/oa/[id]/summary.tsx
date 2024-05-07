import { summarise } from "@/app/prompts/summarise-title";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { Header2, Paragraph } from "@proemial/shadcn-ui";
import { fetchPaper } from "./fetch-paper";
import Markdown from "./markdown";

export default async function Summary<
	TPaper extends {
		id: string;
		data?: { title: string; abstract: string };
		generated?: { title: string };
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

		return <OutPut headline={title} />;
	}

	return <OutPut headline={generatedTitle as string} />;
}

function OutPut({ headline, text }: { headline: string; text?: string }) {
	return (
		<>
			<Markdown>{headline}</Markdown>
			{text && <Paragraph>{text}</Paragraph>}
		</>
	);
}
