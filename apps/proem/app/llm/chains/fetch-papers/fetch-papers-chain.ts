import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { convertToOASearchString } from "./convert-query-parameters";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { fetchPapers } from "@/app/api/paper-search/search";

const constructSearchParametersSchema = z.object({
  keyConcept: z.string()
    .describe(`A single common noun that is VERY likely to occur in the title of
    a research paper that contains the answer to the user's question. The
    argument MUST be a single word.`),
  relatedConcepts: z.string().array()
    .describe(`The most closely related scientific concepts as well as two or
    three synonyms for the key concept. Preferrably two-grams or longer.`),
});

const constructSearchParameters = {
  name: "constructSearchParameters",
  description: `A function to construct a set of search parameters to
      retrieve one or more scientific research papers related to the user's
      question.`,
  parameters: zodToJsonSchema(constructSearchParametersSchema),
};

type SearchParametersOutput = z.infer<typeof constructSearchParametersSchema>;

const jsonOutputFunctionsParser =
  new JsonOutputFunctionsParser<SearchParametersOutput>();

const searchQueryPrompt = ChatPromptTemplate.fromMessages<ChainInput>([
  [
    "system",
    "Construct a set of search parameters that can be used retrieve one or more scientific research papers related to the user's question.",
  ],
  ["human", `{question}`],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-1106", "ask", {
  verbose: true,
});

export type PapersRequest = {
  query: { keyConcept: string; relatedConcepts: string[] };
  papers: { link: string; abstract: string; title: string }[];
};

type ChainInput = { question: string };
type ChainOutput = PapersRequest; // Note: This structure is required for saving answers

const constructSearchParamsChain = RunnableSequence.from<
  ChainInput,
  SearchParametersOutput
>(
  [
    searchQueryPrompt,
    model.bind({
      functions: [constructSearchParameters],
      function_call: { name: constructSearchParameters.name },
    }),
    (input) => input, // This is silly, but it makes the output parser below not stream the response
    jsonOutputFunctionsParser,
  ],
  "ConstructSearchParamsChain",
);

export const fetchPapersChain = RunnableSequence.from<ChainInput, ChainOutput>(
  [
    constructSearchParamsChain,
    {
      query: (input: SearchParametersOutput) => input,
      papers: async (input: SearchParametersOutput) => {
        const query = convertToOASearchString(
          input.keyConcept,
          input.relatedConcepts,
        );
        const papers = await fetchPapers(query);
        return papers?.map(toRelativeLink) ?? [];
      },
    },
  ],
  "FetchPapersChain",
);

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
