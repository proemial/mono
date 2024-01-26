import { StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";

import { convertToOASearchString } from "@/app/api/bot/answer-engine/convert-query-parameters";
import { fetchPapers } from "@/app/api/paper-search/search";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const runtime = "edge";

const model = new ChatOpenAI({
  // TODO! Figure out different temperature settings?
  temperature: 0.8,
  modelName: "gpt-3.5-turbo-1106",
  cache: true,
  verbose: true,
});

const constructSearchParametersSchema = z.object({
  keyConcept: z.string()
    .describe(`A single common noun that is VERY likely to occur in the title of
    a research paper that contains the answer to the user's question. The
    argument MUST be a single word.`),
  relatedConcepts: z.string().array()
    .describe(`The most closely related scientific concepts as well as two or
    three synonyms for the key concept. Preferrably two-grams or longer.`),
});

/*
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: { role: string; content: string }[] = body.messages ?? [];
  const currentMessageContent = messages[messages.length - 1]?.content;

  /**
   * See a full list of supported models at:
   * https://js.langchain.com/docs/modules/model_io/models/
   */

  const bytesOutputParser = new BytesOutputParser();

  const searchQueryPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Construct a set of search parameters that can be used retrieve one or
      more scientific research papers related to the user's question.`,
    ],
    ["human", `{question}`],
  ]);

  const fetchPapersChain = RunnableSequence.from([
    searchQueryPrompt,
    model.bind({
      functions: [
        {
          name: "constructSearchParameters",
          description: `A function to construct a set of search parameters to
          retrieve one or more scientific research papers related to the user's
          question.`,
          parameters: zodToJsonSchema(constructSearchParametersSchema),
        },
      ],
    }),
  ]);

  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
You will provide conclusive answers to user questions, based on the following
research articles: {papers},
IMPORTANT: YOUR ANSWER MUST BE A SINGLE SHORT PARAGRAPH OF 40 WORDS OR LESS KEY
PHRASES FORMATTED AS HYPERLINKS POINTING TO THE PAPERS. THIS IS ESSENTIAL. KEEP
YOUR ANSWERS SHORT AND WITH STATEMENTS THE USER CAN CLICK ON!
- Pick the two papers most relevant to the provided user question.
- Also summarise each of the selected papers into a "title" of 20 words or less
with the most significant finding as an engaging tweet capturing the minds of
other researchers, using layman's terminology, and without mentioning abstract
entities like 'you', 'researchers', 'authors', 'propose', or 'study' but rather
stating the finding as a statement of fact, without reservations or caveats. for
example: "More tooth loss is associated with greater cognitive decline and
dementia in elderly people."
- Then use these summaries to construct a short answer in less than 40 words,
with key phrases of the answer text as hyperlinks pointing to the papers, like
this example:

"""Yes/No. Smoking causes/does not cause cancer. Studies show that cigarette
smokers are <a href="https://proem.ai/oa/W4213460776?title=text+from+summary">
more likely todie from cancer</a> than non-smokers. Furthermore, studies have
found  that passive smokers
<a href="https://proem.ai/oa/W2004456560?title=text+from+summary">hae a higher
risk of cardiovascular disease</a> than people never exposed to a smoking
environment."""

- The links should be pointing to the returned proem links, with the generated
"summaries" appended as a query string to the link

- THE FOLLOWING THREE IMPORTANT RULES ARE ALL ABSOLUTELY ESSENTIAL AND YOU WILL
BE PENALIZED SEVERELY IF THE ANSWER DOES NOT INCLUDE INLINE HYPERLINKS EXACTLY
AS DESCRIBED BELOW:
- IMPORTANT: EVERY ANSWER MUST HAVE AT LEAST TWO HYPERLINKS POINTING TO THE
EXACT FULL URLS OF PAPERS PROVIDED IN THE API RESPONSE. THIS IS ABSOLUTELY
ESSENTIAL.
- IMPORTANT: ALWAYS PLACE HYPERLINKS ON A KEY PHRASE OF THREE TO SIX WORDS
INSIDE THE ANSWER. THIS IS ABSOLUTELY ESSENTIAL. NEVER PLACE URLS AFTER THE
ANSWER.  NEVER EVER CREATE LINKS THAT LOOK LIKE FOOTNOTES. ALWAYS PLACE FULL URL
LINKS INSIDE THE ANSWER.
- IMPORTANT: YOUR ANSWER MUST BE A SINGLE SHORT PARAGRAPH OF 40 WORDS OR LESS
WITH HYPERLINKS ON TWO KEY PHRASES. THIS IS ESSENTIAL. KEEP YOUR ANSWERS SHORT
AND SIMPLE!`,
    ],
    // TODO! Hacky with hack-hack
    // ! fix langchain pipe
    new MessagesPlaceholder('chat_history'),
    ['human', `{question}`],
]);

  const conversationalAnswerEngineChain = RunnableSequence.from([
    {
      question: (input) => input.question,
      chat_history: () =>
        messages.slice(0, -1).map((message) => {
          switch(message.role) {
            case 'user':
              return new HumanMessage({content: message.content})
            default:
            case 'assistant':
              return new AIMessage({content: message.content})
          }
        }),
      papers: async (input) => {
        // TODO! type!
        const searchQuery = parseFunctionCall(
          // invoking searchQuery chain to prevent streaming in the result
          // @ts-expect-error TODO!!!
          await fetchPapersChain.invoke(input)
        );

        if (!searchQuery) {
          return
        }

        const query = convertToOASearchString(
          searchQuery.keyConcept,
          searchQuery.relatedConcepts
        );

        // TODO: Fix case where 0 results from OA causes the pipeline to fail.

        const papers = await fetchPapers(query);
        // TODO! This is quite hacky to do here
        const papersWithRelativeLinks = papers?.map((paper) => ({
          ...paper,
          link: paper.link.replace("https://proem.ai", ""),
        }));

        return JSON.stringify(papersWithRelativeLinks)
      },
    },
    chatPrompt,
    model,
    bytesOutputParser,
  ]);

  const stream = await conversationalAnswerEngineChain.stream({
    chat_history: messages.join("\n"),
    question: currentMessageContent,
  });

  return new StreamingTextResponse(stream);
}

type ParseFunctionCallType = {
  lc_kwargs: {
    additional_kwargs: {
      function_call: {
        // name: string;
        arguments: string;
      };
      tool_calls: undefined;
    };
  };
};

/**
 * hacky way to handle optional JsonOutputFunctionsParser
 */
function parseFunctionCall<T extends ParseFunctionCallType>(response: T) {
  const args = response?.lc_kwargs?.additional_kwargs?.function_call?.arguments;
  return args && JSON.parse(args);
}
