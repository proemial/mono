import { model } from "@/app/api/bot/answer-engine/model";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { fetchPapers } from "../../paper-search/search";
import { convertToOASearchString } from "./convert-query-parameters";

const jsonOutputFunctionsParser = new JsonOutputFunctionsParser();

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
  {
    query: (input) => input,
    papers: async (input) => {
      const query = convertToOASearchString(
        input.keyConcept,
        input.relatedConcepts
      );

      // TODO: Fix case where 0 results from OA causes the pipeline to fail.
      const papers = await fetchPapers(query);
      // TODO! This is quite hacky to do here
      const papersWithRelativeLinks =
        papers?.map((paper) => ({
          ...paper,
          link: paper.link.replace("https://proem.ai", ""),
        })) ?? [];

      return papersWithRelativeLinks;
      // return [
      //   new AIMessage({ content: "" }), // Add function_call parameter how?
      //   new FunctionMessage({
      //     name: constructSearchParameter.name,
      //     content: JSON.stringify(papersWithRelativeLinks),
      //   }),
      // ];
    },
  },
]);
