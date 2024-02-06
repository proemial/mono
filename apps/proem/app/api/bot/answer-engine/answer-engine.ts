import {
  StreamingTextResponse,
  createStreamDataTransformer,
  experimental_StreamData,
} from "ai";

import { AnswerEngineChatMessageHistory } from "@/app/api/bot/answer-engine/answer-engine-memory";
import { convertToOASearchString } from "@/app/api/bot/answer-engine/convert-query-parameters";
import { parseFunctionCall } from "@/app/api/bot/answer-engine/parse-function-call";
import { fetchPapers } from "@/app/api/paper-search/search";
import {
  AIMessage,
  FunctionMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { organizations } from "@/app/prompts/openai-keys";

const bytesOutputParser = new BytesOutputParser();

const model = new ChatOpenAI(
  {
    // TODO! Figure out different temperature settings?
    temperature: 0.8,
    modelName: "gpt-3.5-turbo-1106",
    cache: true,
    verbose: true,
  },
  // Not really sure if this works, so ASK has also been set as the default organisation in the OpenAI admin panel
  { organization: organizations.ask }
);

const constructSearchParametersSchema = z.object({
  keyConcept: z.string()
    .describe(`A single common noun that is VERY likely to occur in the title of
    a research paper that contains the answer to the user's question. The
    argument MUST be a single word.`),
  relatedConcepts: z.string().array()
    .describe(`The most closely related scientific concepts as well as two or
    three synonyms for the key concept. Preferrably two-grams or longer.`),
});

const searchQueryPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Construct a set of search parameters that can be used retrieve one or more scientific research papers related to the user's question.",
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

const chatPrompt = ChatPromptTemplate.fromMessages<AnswerEngineChainInput>([
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
  new MessagesPlaceholder("chatHistory"),
  new MessagesPlaceholder("papers"),
  ["human", `{question}`],
]);

// const messageHistory = new AnswerEngineChatMessageHistory();

const chatChain = chatPrompt.pipe(model);
const chatChainWithHistory = new RunnableWithMessageHistory({
  runnable: chatChain,
  // getMessageHistory: (sessionId) => messageHistory,
  getMessageHistory: (sessionId) =>
    new AnswerEngineChatMessageHistory(sessionId),
  inputMessagesKey: "question",
  historyMessagesKey: "chatHistory",
});

type ChatHistory = { role: string; content: string }[];

type AnswerEngineChainInput = {
  sessionId: string;
  question: string;
  chatHistory: ChatHistory;
};

export type AnswerEngineParams = AnswerEngineChainInput;

const conversationalAnswerEngineChain =
  RunnableSequence.from<AnswerEngineChainInput>([
    {
      question: (input) => input.question,
      chatHistory: (input) =>
        input.chatHistory.map((message) => {
          switch (message.role) {
            case "user":
              return new HumanMessage({ content: message.content });
            case "assistant":
            default:
              return new AIMessage({ content: message.content });
          }
        }),
      papers: async (input) => {
        return [];
        // TODO! type!
        const searchQuery = parseFunctionCall(
          // invoking searchQuery chain to prevent streaming in the result
          // @ts-expect-error TODO!!!
          await fetchPapersChain.invoke(input)
        );

        if (!searchQuery) {
          // Here we use a system message to not make the model believe it gave
          // an empty answer, when going through the chat history.
          return new SystemMessage({ content: "" });
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

        return [
          new AIMessage({ content: "" }), // Add function_call parameter how?
          new FunctionMessage({
            name: "name_of_function",
            content: "result_of_function", // content: JSON.stringify(papersWithRelativeLinks),
          }),
        ];
      },
    },
    chatChainWithHistory,
    bytesOutputParser, // TODO: Can this parse papers through?
  ]);

export async function askAnswerEngine({
  question,
  chatHistory,
  sessionId,
}: AnswerEngineParams) {
  const data = new experimental_StreamData();

  data.append({
    sessionId,
  });

  const stream = await conversationalAnswerEngineChain.stream(
    {
      sessionId,
      chatHistory,
      question,
    },
    {
      configurable: { sessionId },
      callbacks: [
        {
          handleChainEnd(_outputs, _runid, parentRunId) {
            // check that main chain (without parent) is finished:
            if (parentRunId == null) {
              data.close();
            }
          },
        },
      ],
    }
  );

  return new StreamingTextResponse(
    stream.pipeThrough(createStreamDataTransformer(true)),
    {},
    data
  );
}
