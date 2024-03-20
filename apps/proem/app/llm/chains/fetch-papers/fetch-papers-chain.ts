import { type Paper, fetchPapers } from "@/app/api/paper-search/search";
import { getFeatureFlag } from "@/app/components/feature-flags/server-flags";
import {
	RunnableLambda,
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { generateKeywordsChain } from "./generate-keywords-chain";
import {
	type Output as SearchParams,
	generateSearchParamsChain,
} from "./generate-search-params-chain";

type Input = {
	question: string;
	papers: Paper[];
};

type OpenAlexQueryParams = {
	searchQuery: string;
};

export type PapersAsString = string;

const generateOpenAlexSearch = RunnableLambda.from<
	SearchParams,
	OpenAlexQueryParams // & { link: string }
>(async (input) => {
	const useKeywords = (await getFeatureFlag("useKeywordsForOaQuery")) ?? false;
	console.info(
		useKeywords
			? "Using keywords for OA query"
			: "Using key- and related concepts for OA query",
	);
	const concepts = useKeywords
		? input.keywords
		: [input.keyConcept, ...input.relatedConcepts];
	const searchQuery = convertToOASearchString(concepts);
	return {
		searchQuery,
		//TODO! OpenAlex search is currently down, so add link when it's back up
		// link: "https://openalex.org/",
	};
}).withConfig({ runName: "GenerateOpenAlexSearch" });

const queryOpenAlex = RunnableLambda.from<OpenAlexQueryParams, Paper[]>(
	async (input) => {
		const papers = await fetchPapers(input.searchQuery);
		return papers?.map(toRelativeLink) ?? [];
	},
).withConfig({ runName: "QueryOpenAlex" });

export const fetchPapersChain = RunnableSequence.from<Input, PapersAsString>([
	RunnablePassthrough.assign({
		keywords: generateKeywordsChain(),
		papers: generateSearchParamsChain()
			.pipe(generateOpenAlexSearch)
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

const convertToOASearchString = (concepts: string[]) => {
	const searchStrings = concepts.map((concept) => `"${concept}"`).join("OR");
	const query = `title.search:(${searchStrings}),abstract.search:(${searchStrings})`;
	return encodeURIComponent(query);
};
