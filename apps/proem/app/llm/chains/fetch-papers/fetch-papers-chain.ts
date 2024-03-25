import { fetchPapers, type Paper } from "@/app/api/paper-search/search";
import {
	RunnableLambda,
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { searchSynonymsChain } from "./extract-synonyms-chain";
import { searchParamsChain } from "./generate-search-params-chain";
import { OpenAlexQueryParams } from "./oa-search-helpers";

type Input = {
	question: string;
	papers: Paper[] | undefined;
};

export type PapersAsString = string;

const queryOpenAlex = RunnableLambda.from<OpenAlexQueryParams, Paper[]>(
	async (input) => {
		const papers = [] as Paper[];
		for (const query of input.searchQueries) {
			const result = await fetchPapers(query);
			papers.push(...result);

			if (papers?.length > 5) {
				break;
			}
		}
		return papers?.map(toRelativeLink) ?? [];
	},
).withConfig({ runName: "QueryOpenAlex" });

export const fetchPapersChain = RunnableSequence.from<Input, PapersAsString>([
	RunnablePassthrough.assign({
		papers: searchParamsChain
			.pipe(queryOpenAlex)
			.withConfig({ runName: "FetchPapers" }),
	}),
	(input) => JSON.stringify(input.papers),
]);

export const fetchPapersChainNew = RunnableSequence.from<Input, PapersAsString>(
	[
		RunnablePassthrough.assign({
			papers: searchSynonymsChain
				.pipe(queryOpenAlex)
				.withConfig({ runName: "FetchPapers" }),
		}),
		(input) => JSON.stringify(input.papers),
	],
);

const toRelativeLink = (paper: Paper) => {
	return {
		title: paper.title,
		link: paper.link.replace("https://proem.ai", ""),
		abstract: paper.abstract ?? "",
	};
};
