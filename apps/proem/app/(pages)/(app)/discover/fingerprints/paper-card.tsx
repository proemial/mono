"use server";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { summarise } from "@/app/prompts/summarise-title";
import FeedItem from "../feed-item";

export async function PaperCard({ paper }: { paper: OpenAlexPaper }) {
	const enhancedPaper = await enhancePaper(paper);

	return <FeedItem paper={enhancedPaper} />;
}

async function enhancePaper(paper: OpenAlexPaper) {
	if (!paper.generated?.title && paper.data.title && paper.data.abstract) {
		const title = (await summarise(
			paper.data.title,
			paper.data.abstract,
		)) as string;
		const generated = paper.generated
			? { ...paper.generated, title }
			: { title };

		return {
			...paper,
			generated,
		};
	}
	return paper;
}
