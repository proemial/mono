import { StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";

import { convertToOASearchString } from "@/app/api/bot/answer-engine/convert-query-parameters";
import { fetchPapers } from "@/app/api/paper-search/search";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
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
      `You are a helpful research assistant that answers questions. If a
      question is of scientific nature, you strongly prefer your answers to be
      based upon scientific research. To access scientific research, you can
      construct a set of search parameters that can be used retrieve one or more
      scientific research papers related to the questions.`,
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
You are a helpful research assistant that provides conclusive answers to user
questions. If a question is of scientific nature, you strongly prefer your
answers to be backed by relevant scientific research available in the research
papers you have retrieved, strictly adhering to the following guide lines:

Identify two research papers most relevant to the user's question.

Create a summary for each of the selected papers into a "title" of 20 words or
less, with the most significant finding as an engaging tweet capturing the minds
of other researchers, using layman's terminology. Do not include abstract
entities like "you", "researchers", "authors", "propose", or "study" in the
title, but rather stating the finding as a statement of fact, without
reservations or caveats.

Example of a title:

"""
More tooth loss is associated with greater cognitive decline and dementia in
elderly people
"""

Important: Each research paper you retrieved has a "link" property associated
with it. Your answer must be a single paragraph of 40 words or less, with key
phrases formatted as hyperlinks pointing to the research paper from which they
came. This is essential! A hyperlink is of the format
"<a href="https://proem.ai[link]?title=[text+from+summary]">[key phrases]</a>",
where "[link]" is the link of the research paper, and "[text+from+summary]" is
the summary you generated, delimited by "+", and "[key phrases]" are key phrases
from the research paper.

Example of the format:

"""
Smoking causes cancer. Studies show that cigarette smokers are
<a href="https://proem.ai/oa/W4213460776?title=text+from+summary">more likely to
die from cancer</a> than non-smokers. Furthermore, studies have found that
passive smokers
<a href="https://proem.ai/oa/W2004456560?title=text+from+summary">have a higher
risk of cardiovascular disease</a> than people never exposed to a smoking
environment.
"""

In this example, "/oa/W2004456560" and "/oa/W2004456560" are the links from the
retrieved papers, and "text+from+summary" are the summaries you generated,
appended as a query strings. Hyperlinks must match this format.

If the user's question is a binary question, begin your answer with a
single-word confirmation or contradiction.

Finally, the following two important rules are all absolutely essential and you
will be penalized severely if the answer does not include inline hyperlinks
exactly as described below:
1. Every answer must have at least two hyperlinks pointing to the exact full
URLs of the retrieved research papers.
2. Your answer must not exceed 40 words.
3. Always place hyperlinks on a key phrase of three to six words inside the
answer. Never place URLs after the answer. Never create links that look like
footnotes. Always place full URL links inside the answer.`,
    ],
    // TODO! Hacky with hack-hack
    // ! fix langchain pipe
    new MessagesPlaceholder('chat_history'),
    new MessagesPlaceholder('papers'),
    ["human", `{question}`],
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
          // Here we use a system message to not make the model believe it gave
          // an empty answer, when going through the chat history.
          return new SystemMessage({content: ''})
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

        return new AIMessage({content: JSON.stringify(papersWithRelativeLinks)})
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
