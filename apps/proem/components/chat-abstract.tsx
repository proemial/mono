"use server";
import { summariseDescription } from "@proemial/adapters/llm/prompts/description";
import { Redis } from "@proemial/adapters/redis";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import Markdown from "./markdown";
import { SourceProduct } from "@proemial/adapters/llm/models";

export async function MicroAbstract({
	paper,
	source,
}: {
	paper: OpenAlexPaper;
	source?: SourceProduct;
}) {
	if (!paper.data.title || !paper.data.abstract) return;

	if (paper.generated?.abstract) {
		return (
			<div className="text-base/relaxed break-words">
				<Markdown>{paper.generated?.abstract}</Markdown>
			</div>
		);
	}

	const microAbstract = await summariseDescription(
		paper.data.title,
		paper.data.abstract,
		source,
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
		<div className="text-base/relaxed break-words">
			<Markdown>{microAbstract ?? ""}</Markdown>
		</div>
	);
}
