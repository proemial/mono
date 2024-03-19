import { type Paper, fetchPapers } from "@/app/api/paper-search/search";
import { selectRelevantPapersChain } from "@/app/llm/chains/fetch-papers/select-relevant-papers-chain";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
	RunnableLambda,
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { generateKeywordsChain } from "./generate-keywords-chain";

const generateSearchParamsSchema = z.object({
	keyConcept: z.string().describe(`A single common noun that is VERY likely to occur in the title of
    a research paper that contains the answer to the user's question. The
    argument MUST be a single word.`),
	relatedConcepts: z
		.string()
		.array()
		.describe(`The most closely related scientific concepts as well as two or
    three synonyms for the key concept. Preferrably two-grams or longer.`),
});

const generateSearchParams = {
	name: "generateSearchParams",
	description: `A function to generate a set of search parameters to
      retrieve one or more scientific research papers related to the user's
      question.`,
	parameters: zodToJsonSchema(generateSearchParamsSchema),
};

type GeneratedSearchParams = z.infer<typeof generateSearchParamsSchema>;

const generateSearchParamsPrompt = ChatPromptTemplate.fromMessages<Input>([
	[
		"system",
		"Generate a set of search parameters that can be used retrieve one or more scientific research papers related to the user's question.",
	],
	["human", "{question}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask", {
	verbose: process.env.NODE_ENV === "development" ? true : false,
	cache: process.env.NODE_ENV === "development" ? false : true,
});

const generateSearchParamsChain = RunnableSequence.from<
	Input,
	GeneratedSearchParams
>([
	generateSearchParamsPrompt,
	model.bind({
		functions: [generateSearchParams],
		function_call: { name: generateSearchParams.name },
	}),
	(input) => input, // This is silly, but it makes the output parser below not stream the response
	new JsonOutputFunctionsParser<GeneratedSearchParams>(),
]).withConfig({
	runName: "GenerateSearchParams",
});

type OpenAlexQueryParams = {
	searchQuery: string;
};

const generateOpenAlexSearchChain = RunnableLambda.from<
	GeneratedSearchParams,
	OpenAlexQueryParams & GeneratedSearchParams // & { link: string }
>((input) => {
	const searchQuery = convertToOASearchString([
		...input.relatedConcepts,
		input.keyConcept,
	]);
	return {
		...input,
		searchQuery,
		//TODO! OpenAlex search is currently down, so add link when it's back up
		// link: "https://openalex.org/",
	};
}).withConfig({ runName: "GenerateOpenAlexSearch" });

export type PapersAsString = string;

const queryOpenAlexChain = RunnableLambda.from<
	OpenAlexQueryParams & GeneratedSearchParams,
	GeneratedSearchParams & { papers: Paper[] }
>(async (input) => {
	const papers = await fetchPapers(input.searchQuery);
	return {
		...input,
		papers: papers?.map(toRelativeLink) ?? [],
	};
}).withConfig({ runName: "QueryOpenAlex" });

const filterOnlyAbstractsWithKeyConcept = RunnableLambda.from<
	GeneratedSearchParams & { papers: Paper[] },
	PapersAsString
>((input) => {
	const filteredPapers = input.papers.filter((paper) =>
		containsWords([input.keyConcept], paper.abstract ?? ""),
	);
	return JSON.stringify(filteredPapers);
});

const containsWords = (words: string[], text: string) =>
	words.every((word) => text.includes(word));

export const fetchPapersChain = RunnableSequence.from<Input, PapersAsString>([
	RunnablePassthrough.assign({
		keywords: generateKeywordsChain(),
		papers: generateSearchParamsChain
			.pipe(generateOpenAlexSearchChain)
			.pipe(queryOpenAlexChain)
			.pipe(filterOnlyAbstractsWithKeyConcept)
			.withConfig({ runName: "FetchPapers" }),
	}),
	selectRelevantPapersChain,
	(selectedPapers) => JSON.stringify(selectedPapers),
]);

type Input = {
	question: string;
	papers: { link: string; abstract: string; title: string }[] | undefined;
};

type Output = string;

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
