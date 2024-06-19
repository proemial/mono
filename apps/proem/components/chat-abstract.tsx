"use server";
import { summariseAbstract } from "@/app/prompts/summarise-abstract";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Redis } from "@proemial/redis/redis";
import { Paragraph } from "@proemial/shadcn-ui";
import Markdown from "./markdown";

export async function MicroAbstract({ paper }: { paper: OpenAlexPaper }) {
	if (!paper.data.title || !paper.data.abstract) return;

	if (paper.generated?.abstract) {
		return (
			<Paragraph>
				<Markdown>{paper.generated?.abstract}</Markdown>
			</Paragraph>
		);
	}

	const microAbstract = await summariseAbstract(
		paper.data.title,
		paper.data.abstract,
	);

	await Redis.papers.upsert(paper.id, (existingPaper) => {
		const generated = {
			...existingPaper.generated,
			abstract: microAbstract ?? undefined,
		};

		return {
			...existingPaper,
			generated,
		};
	});

	return (
		<Paragraph>
			<Markdown>{microAbstract ?? ""}</Markdown>
		</Paragraph>
	);
}
