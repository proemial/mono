import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const buildSearchParamsFunctionSchema = z.object({
  keyConcept: z.string()
    .describe(`A single common noun that is VERY likely to occur in the title of
    a research paper that contains the answer to the user's question. The
    argument MUST be a single word.`),
  relatedConcepts: z.string().array()
    .describe(`The most closely related scientific concepts as well as two or
    three synonyms for the key concept. Preferrably two-grams or longer.`),
});

type SearchParameters = z.infer<typeof buildSearchParamsFunctionSchema>;

const buildSearchParamsPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Build a set of search parameters that can be used retrieve one or more
    scientific research papers related to the user's question.`,
  ],
  ["human", `{question}`],
]);

const jsonOutputFunctionsParser =
  new JsonOutputFunctionsParser<SearchParameters>();

export const getBuildSearchParamsChain = (model: ChatOpenAI) =>
  RunnableSequence.from<{ question: string }, SearchParameters>([
    buildSearchParamsPrompt,
    model.bind({
      functions: [
        {
          name: "buildSearchParams",
          description: `A function to build a set of search parameters to
          retrieve one or more scientific research papers related to the user's
          question.`,
          parameters: zodToJsonSchema(buildSearchParamsFunctionSchema),
        },
      ],
    }),
    (input) => input, // This makes the JSON not streamed
    jsonOutputFunctionsParser,
  ]);
