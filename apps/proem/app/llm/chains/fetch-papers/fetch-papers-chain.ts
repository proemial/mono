import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { FetchPapersTool } from "../../tools/fetch-papers-tool";

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

const fetchPapersTool = new FetchPapersTool();

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

type Input = { question: string };

type Output = GeneratedSearchParams;

const generateSearchParamsChain = RunnableSequence.from<Input, Output>([
	generateSearchParamsPrompt,
	model.bind({
		functions: [generateSearchParams],
		function_call: { name: generateSearchParams.name },
	}),
	(input) => input, // This is silly, but it makes the output parser below not stream the response
	jsonOutputFunctionsParser,
]).withConfig({
	runName: "GenerateSearchParams",
});

export const fetchPapersChain = RunnableSequence.from<Input, string>([
	generateSearchParamsChain,
	fetchPapersTool,
]);
