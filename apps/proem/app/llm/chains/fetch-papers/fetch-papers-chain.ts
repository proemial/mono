import { selectRelevantPapersChain } from "@/app/llm/chains/fetch-papers/select-relevant-papers-chain";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { FetchPapersTool } from "@/app/llm/tools/fetch-papers-tool";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
	RunnableBranch,
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

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

type Input = {
	question: string;
	papers: { link: string; abstract: string; title: string }[] | undefined;
};

type Output = GeneratedSearchParams;

const generateSearchParamsChain = RunnableSequence.from<Input, Output>([
	generateSearchParamsPrompt,
	model.bind({
		functions: [generateSearchParams],
		function_call: { name: generateSearchParams.name },
	}),
	(input) => input, // This is silly, but it makes the output parser below not stream the response
	new JsonOutputFunctionsParser<GeneratedSearchParams>(),
]).withConfig({ runName: "GenerateSearchParams" });

const fetchPapersChain = RunnableSequence.from<Input, string>([
	RunnablePassthrough.assign({
		papers: generateSearchParamsChain
			.pipe(new FetchPapersTool())
			.withConfig({ runName: "FetchPapers" }),
	}),
	selectRelevantPapersChain,
	(selectedPapers) => JSON.stringify(selectedPapers),
]);

const hasCachedPapers = (input: Input) => input.papers !== undefined;

export const fetchIfNoCachedPapers = RunnableBranch.from<Input, string>([
	[hasCachedPapers, (input) => JSON.stringify(input.papers)],
	fetchPapersChain,
]);
