import { StreamingTextResponse, Message as VercelChatMessage } from "ai";
import { NextRequest } from "next/server";

import { convertToOASearchString } from "@/app/api/bot/answer-engine/convert-query-parameters";
import { fetchPapers } from "@/app/api/paper-search/search";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const runtime = "edge";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const searchParametersSchema = z.object({
  keyConcept: z
    .string()
    .describe(
      "A single common noun that is VERY likely to occur in the title of a research paper relevant to answering the original user question"
    ),
  relatedConcepts: z
    .string()
    .array()
    .describe(
      "The most closely related scientific concepts as well as two or three synonyms for the key concept"
    ),
});

// Format the messages
/*
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = body.messages ?? [];
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content as string;

  /**
   * See a full list of supported models at:
   * https://js.langchain.com/docs/modules/model_io/models/
   */
  const model = new ChatOpenAI({
    // TODO! Figure out different temperature settings?
    temperature: 0.8,
    modelName: "gpt-3.5-turbo-1106",
    cache: true,
    verbose: true,
  });

  const bytesOutputParser = new BytesOutputParser();
  const jsonOutputFunctionsParser = new JsonOutputFunctionsParser();

  const searchQueryPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Based on the user question, construct an array of strings for each of the key concepts and verbs in the original user question, the most closely related scientific concept as well as two or three synonyms. Both the scientific concepts and synonyms should preferably be two-grams or longer.
      For example, given the user question: "does smoking cause lung cancer", you would construct an string array in the following format, which includes the original terms from the question ["smoking", "cause", "cancer"] plus a few related scientific concepts and synonyms: ["smoking", "tobacco use", "nicotine exposure", "cause", "induce", "trigger", "lead to", "lung cancer", "lung malignancy", "lung neoplasm"].
      Then, you should identify A SINGLE COMMON NOUN that is VERY likely to occur in the title of a research paper relevant to answering the original user question. For the above example, that could simply be "smoking". It is very important that you pick a SINGLE NOUN, not a noun phrase. Just ONE common word. No spaces or hyphens.
      `,
    ],
    ["human", `{question}`],
  ]);

  const searchQueryChain = RunnableSequence.from([
    searchQueryPrompt,
    model.bind({
      functions: [
        {
          name: "searchParameters",
          description:
            "Search parameters to fetch papers related to the users question",
          parameters: zodToJsonSchema(searchParametersSchema),
        },
      ],
      function_call: { name: "searchParameters" },
    }),
    jsonOutputFunctionsParser,
    RunnablePassthrough.assign({
      papers: async (input) => {
        console.log(input);
        const query = convertToOASearchString(
          input.keyConcept,
          input.relatedConcepts
        );
        console.log({ query });
        const papers = await fetchPapers(query);
        console.log(papers.length);
        // TODO! This is quite hacky to do here
        const papersWithRelativeLinks = papers?.map((paper) => ({
          ...paper,
          link: paper.link.replace("https://proem.ai", ""),
        }));
        return JSON.stringify(papersWithRelativeLinks);
      },
    }),
  ]);

  // const fetchPapersChain = RunnableSequence.from([])

  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You will provide conclusive answers to user questions, based on the following research articles:
      {papers},
      IMPORTANT: YOUR ANSWER MUST BE A SINGLE SHORT PARAGRAPH OF 40 WORDS OR LESS KEY PHRASES FORMATTED AS HYPERLINKS POINTING TO THE PAPERS.
      THIS IS ESSENTIAL. KEEP YOUR ANSWERS SHORT AND WITH STATEMENTS THE USER CAN CLICK ON!
      - Pick the two papers most relevant to the provided user question.
      - Also summarise each of the selected papers into a "microtitle" of 20 words or less with the most significant finding as an engaging tweet capturing the minds of other researchers, using layman's terminology, and without mentioning abstract entities like 'you',  'researchers', 'authors', 'propose', or 'study' but rather stating the finding as a statement of fact, without reservations or caveats. for example: "More tooth loss is associated with greater cognitive decline and dementia in elderly people."
      - Then use these summaries to construct a short answer in less than 40 words, with key phrases of the answer text as hyperlinks pointing to the papers, like this example:
      """Yes/No. Smoking causes/do not cause cancer. Studies show that cigarette smokers are <a href="https://proem.ai/oa/W4213460776?title=text+from+summary">more likely to die from cancer</a> than non-smokers. Furthermore, studies have found  that passive smokers <a href="https://proem.ai/oa/W2004456560?title=text+from+summary">hae a higher risk of cardiovascular disease</a> than people never exposed to a smoking environment."""
      - The links should be pointing to the returned proem links, with the generated "summaries" appended as a query string to the link

      - THE FOLLOWING THREE IMPORTANT RULES ARE ALL ABSOLUTELY ESSENTIAL AND YOU WILL BE PENALIZED SEVERELY IF THE ANSWER DOES NOT INCLUDE INLINE HYPERLINKS EXACTLY AS DESCRIBED BELOW:
      - IMPORTANT: EVERY ANSWER MUST HAVE AT LEAST TWO HYPERLINKS POINTING TO THE EXACT FULL URLS OF PAPERS PROVIDED IN THE API RESPONSE. THIS IS ABSOLUTELY ESSENTIAL.
      - IMPORTANT: ALWAYS PLACE HYPERLINKS ON AKEY PHRASE OF THREE TO SIX WORDS INSIDE THE ANSWER. THIS IS ABSOLUTELY ESSENTIAL. NEVER PLACE URLS AFTER THE ANSWER. NEVER EVER CREATE LINKS THAT LOOK LIKE FOOTNOTES. ALWAYS PLACE FULL URL LINKS INSIDE THE ANSWER.
      - IMPORTANT: YOUR ANSWER MUST BE A SINGLE SHORT PARAGRAPH OF 40 WORDS OR LESS WITH HYPERLINKS ON TWO KEY PHRASES. THIS IS ESSENTIAL. KEEP YOUR ANSWERS SHORT AND SIMPLE!
      `,
    ],
    ["human", `{question}`],
  ]);
  const chatAnswerChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      // TODO! question shouldn't be injected but parsed through
      question: () => currentMessageContent,
    }),
    chatPrompt,
    model,
    bytesOutputParser,
  ]);

  const conversationalAnswerEngineChain =
    searchQueryChain.pipe(chatAnswerChain);

  const stream = await conversationalAnswerEngineChain.stream({
    chat_history: formattedPreviousMessages.join("\n"),
    question: currentMessageContent,
  });

  return new StreamingTextResponse(stream);
}
