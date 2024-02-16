import { model } from "@/app/api/bot/answer-engine/model";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { convertToOASearchString } from "./convert-query-parameters";
import { PaperRetriever } from "./paper-retriever";

const jsonOutputFunctionsParser = new JsonOutputFunctionsParser();
const paperRetriever = new PaperRetriever()

const constructSearchParametersSchema = z.object({
  keyConcept: z.string()
    .describe(`A single common noun that is VERY likely to occur in the title of
    a research paper that contains the answer to the user's question. The
    argument MUST be a single word.`),
  relatedConcepts: z.string().array()
    .describe(`The most closely related scientific concepts as well as two or
    three synonyms for the key concept. Preferrably two-grams or longer.`),
});

const constructSearchParameter = {
  name: "constructSearchParameters",
  description: `A function to construct a set of search parameters to
      retrieve one or more scientific research papers related to the user's
      question.`,
  parameters: zodToJsonSchema(constructSearchParametersSchema),
};

const searchQueryPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Construct a set of search parameters that can be used retrieve one or more scientific research papers related to the user's question.",
  ],
  ["human", `{question}`],
]);

export const fetchPapersChain = RunnableSequence.from([
  searchQueryPrompt,
  model.bind({
    functions: [constructSearchParameter],
    function_call: { name: constructSearchParameter.name },
  }),
  jsonOutputFunctionsParser,
  (input) => convertToOASearchString(input.keyConcept, input.relatedConcepts),
  {
    papers: paperRetriever.pipe(formatDocumentsAsString),
  },
]);
