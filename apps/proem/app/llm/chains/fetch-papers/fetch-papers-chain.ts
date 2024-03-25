import { fetchPapers, type Paper } from "@/app/api/paper-search/search";
import {
	RunnableLambda,
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { searchParamsChain } from "./generate-search-params-chain";
import { OpenAlexQueryParams } from "./oa-search-helpers";

type Input = {
	question: string;
	papers: Paper[] | undefined;
};

export type PapersAsString = string;

const queryOpenAlex = RunnableLambda.from<OpenAlexQueryParams, Paper[]>(
	async (input) => {
		const promises = input.searchQueries.map((query) => fetchPapers(query));
		const results = await Promise.all(promises);

		const papers = [] as Paper[];
		for (const result of results) {
			// TODO: Somehow enrich LangSmith about paper count pushed from each query
			papers.push(...result);

			// Preferably go with at least 5 from the most narrow queries
			// TODO: Filter out duplicates
			if (papers?.length > 5) {
				break;
			}
		}
		return papers?.slice(0, 30).map(toRelativeLink) ?? [];
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

const toRelativeLink = (paper: Paper) => {
	return {
		title: paper.title,
		link: paper.link.replace("https://proem.ai", ""),
		abstract: paper.abstract ?? "",
	};
};
