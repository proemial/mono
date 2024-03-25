import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import type { ChatOpenAICallOptions } from "@langchain/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { buildOpenAIChatModel } from "../../models/openai-model";
import { getFeatureFlag } from "@/app/components/feature-flags/server-flags";
import { OpenAlexQueryParams } from "./oa-search-helpers";

type Input = {
	question: string;
};
export type Output = z.infer<typeof schema>;

const schema = z.object({
	keyConcept: z.string().describe(`A single common noun that is VERY likely to occur in the title of
    a research paper that contains the answer to the user's question. The
    argument MUST be a single word.`),
	relatedConcepts: z
		.string()
		.array()
		.describe(`The most closely related scientific concepts as well as two or
    three synonyms for the key concept. Preferrably two-grams or longer.`),
	keywords: z
		.string()
		.array()
		.describe(`Based on a given user question, for each of the key concepts
		and verbs in the question provide three closely related scientific
		concepts as well as three synonyms. Both the scientific concepts and
		synonyms should preferably be two-grams or longer. If you cannot
		complete the task, provide an empty array (\`[]\`).

		Example: User question: \`Does smoking cause lung cancer?\` Your
		response: \`[smoking,tobacco use,nicotine exposure,cause,induce,trigger,lead to,lung cancer,lung malignancy,lung neoplasm]\``),
});

const generateSearchParamsFn = {
	name: "generateSearchParams",
	description: `A function to generate a set of search parameters to
      retrieve one or more scientific research papers related to the user's
      question.`,
	parameters: zodToJsonSchema(schema),
};

const prompt = ChatPromptTemplate.fromMessages<Input>([
	[
		"system",
		`Generate a set of search parameters that can be used retrieve one or
		more scientific research papers related to the user's question.`,
	],
	["human", "{question}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask", {
	temperature: 0.0,
	verbose: process.env.NODE_ENV === "development" ? true : false,
	cache: process.env.NODE_ENV === "development" ? false : true,
});

export const generateSearchParamsChain = (
	modelOverride: BaseChatModel<ChatOpenAICallOptions> = model,
) =>
	RunnableSequence.from<Input, Output>([
		prompt,
		modelOverride.bind({
			functions: [generateSearchParamsFn],
			function_call: { name: generateSearchParamsFn.name },
		}),
		(input) => input, // This is silly, but it makes the output parser below not stream the response
		new JsonOutputFunctionsParser<Output>(),
	]).withConfig({
		runName: "GenerateSearchParams",
	});

export const generateOpenAlexSearch = RunnableLambda.from<
	Output,
	OpenAlexQueryParams
>(async (input) => {
	const isUsingKeywords =
		(await getFeatureFlag("useKeywordsForOaQuery")) ?? false;
	const concepts = isUsingKeywords
		? input.keywords
		: [input.keyConcept, ...input.relatedConcepts];
	const searchQuery = convertToOASearchString(concepts);
	return {
		searchQueries: [searchQuery],
	};
}).withConfig({ runName: "GenerateOpenAlexSearch" });

const convertToOASearchString = (concepts: string[]) => {
	const searchStrings = concepts.map((concept) => `"${concept}"`).join("OR");
	const query = `title.search:(${searchStrings}),abstract.search:(${searchStrings})`;
	return encodeURIComponent(query);
};

export const searchParamsChain = generateSearchParamsChain().pipe(
	generateOpenAlexSearch,
);
