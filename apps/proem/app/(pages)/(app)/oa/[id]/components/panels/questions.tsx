import { generateStarters } from "@/app/prompts/starters";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { PaperChat } from "./chat/paper-chat";

type Props = {
	paper: OpenAlexPaper;
	closed?: boolean;
};

export async function QuestionsPanel(props: Props) {
	const { paper } = props;
	const starters = paper?.generated?.starters
		? paper?.generated?.starters
		: await generate(paper);

	return <PaperChat {...props} starters={starters} />;
}

async function generate(paper: OpenAlexPaper) {
	const paperTitle = paper?.data?.title;
	const abstract = paper?.data?.abstract;

	if (paperTitle && abstract) {
		const starters = await generateStarters(paperTitle, abstract);

		await Redis.papers.upsert(paper.id, (existingPaper) => {
			const generated = existingPaper.generated
				? { ...existingPaper.generated, starters }
				: { starters };

			return {
				...existingPaper,
				generated,
			};
		});

		return starters;
	}
	return [];
}
