"use server";

import { Redis } from "@proemial/adapters/redis";

// https://www.oxen.ai/blog/reading-list-for-andrej-karpathys-intro-to-large-language-models-video
const ANDREJ_KARPATHY_LLM_READING_LIST = [
	"w4385245566",
	// missing
	"w4226278401",
	"w4384918448",
	"w4386437475",
	"w4378771755",
	"w4225591000",
	"w3001279689",
	"w4360836968",
	"w4221143046",
	"w4377130677",
	"w4388926587",
	"w3027879771",
	"w4313304293",
	"w3094502228",
	"w3166396011",
	"w4386076097",
	"w4386655647",
	"w4366330503",
	"w4378510493",
	"w4229042118",
	"w4388844352",
	"w4320165837",
	"w4378718568",
	"w4385474529",
	"w4383473937",
	"w4385374425",
	"w4393157467",
	"w4388886073",
	// missing
	"w4367701241",
	"w4321472284",
];
export async function fetchReadingList() {
	const cachedPapers = await Redis.papers.getAll(
		ANDREJ_KARPATHY_LLM_READING_LIST,
	);

	const cachedPapersIds = cachedPapers
		.map((cachedPaper) =>
			// we only consider a cachedPaper valid if it has a generated title
			cachedPaper?.generated?.title ? cachedPaper?.id : null,
		)
		.filter(Boolean);

	const cacheMisses = ANDREJ_KARPATHY_LLM_READING_LIST.filter(
		(paperId) => !cachedPapersIds.includes(paperId),
	);

	return { rows: cachedPapers };
}
