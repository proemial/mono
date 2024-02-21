import { fetchPapers } from "@/app/api/paper-search/search";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableMap, RunnableSequence } from "@langchain/core/runnables";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { convertToOASearchString } from "./convert-query-parameters";

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

const jsonOutputFunctionsParser =
	new JsonOutputFunctionsParser<GeneratedSearchParams>();

const generateSearchParamsPrompt = ChatPromptTemplate.fromMessages<ChainInput>([
	[
		"system",
		"Generate a set of search parameters that can be used retrieve one or more scientific research papers related to the user's question.",
	],
	["human", "{question}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-1106", "ask", {
	verbose: true,
});

export type PapersRequest = {
	searchParams: { keyConcept: string; relatedConcepts: string[] };
	papers: { link: string; abstract: string; title: string }[];
};

type ChainInput = { question: string };
type ChainOutput = PapersRequest; // Note: This structure is required for saving answers

const generateSearchParamsChain = RunnableSequence.from<
	ChainInput,
	GeneratedSearchParams
>([
	generateSearchParamsPrompt,
	model
		.bind({
			functions: [generateSearchParams],
			function_call: { name: generateSearchParams.name },
		})
		.withConfig({
			runName: "AskForSearchParams",
		}),
	(input) => input, // This is silly, but it makes the output parser below not stream the response
	jsonOutputFunctionsParser,
]).withConfig({
	runName: "GenerateSearchParams",
});

export const fetchPapersChain = RunnableSequence.from<ChainInput, ChainOutput>([
	generateSearchParamsChain,
	RunnableMap.from<GeneratedSearchParams, ChainOutput>({
		searchParams: (input: GeneratedSearchParams) => input,
		papers: async (input: GeneratedSearchParams) => {
			const searchString = convertToOASearchString(
				input.keyConcept,
				input.relatedConcepts,
			);
			const papers = await fetchPapers(searchString);
			return papers?.map(toRelativeLink) ?? [];
		},
	}).withConfig({
		runName: "QueryOpenAlex",
	}),
]);

type FetchPaperResult = {
	title: string;
	link: string;
	abstract?: string;
};

const toRelativeLink = (paper: FetchPaperResult) => ({
	title: paper.title,
	link: paper.link.replace("https://proem.ai", ""),
	abstract: paper.abstract ?? "",
});
