import { StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";

import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import {
  BytesOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { JsonMarkdownStructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  RunnableBranch,
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { convertToOASearchString } from "./convert-query-parameters";
import { initialPrompt } from "./prompts/initial-prompt";

export const runtime = "edge";

type ChatHistory = { role: string; content: string }[];

type AnswerEngineChainInput = {
  question: string;
  chatHistory: ChatHistory;
};

const model = new ChatOpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo-1106",
  cache: false,
  verbose: true,
});

const schema = z.object({
  keyConcept: z.string()
    .describe(`A single common noun that is VERY likely to occur in the title of
    a research paper that contains the answer to the user's question. The
    argument MUST be a single word.`),
  relatedConcepts: z.string().array()
    .describe(`The most closely related scientific concepts as well as two or
    three synonyms for the key concept. Preferrably two-grams or longer.`),
});

type SearchParams = z.infer<typeof schema>;

const searchParamParser =
  JsonMarkdownStructuredOutputParser.fromZodSchema(schema);
const stringOutputParser = new StringOutputParser();
const bytesOutputParser = new BytesOutputParser();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: ChatHistory = body.messages ?? [];
  const chatHistory = messages.slice(0, -1);
  const currentMessageContent = messages[messages.length - 1]!.content;

  // const fetchPapersPrompt = ChatPromptTemplate.fromMessages([
  //   ["system", initialPrompt]
  // ]);

  // const fetchPapersChain = RunnableSequence.from<string, string>([
  //   searchParamParser,
  //   {
  //     // TODO: Fetch papers
  //     papers: (input) => {
  //       console.log("#################3");
  //       console.log(input);
  //       console.log("#################3");
  //     },
  //   },
  //   fetchPapersPrompt,
  //   model,
  //   stringOutputParser,
  // ]);

  // const branch = RunnableBranch.from([
  //   [
  //     async (x: string) => {
  //       const searchParams = await searchParamParser.parse(x);
  //       return true;
  //       // x.includes('jon'),
  //     },
  //     fetchPapersChain,
  //   ],
  //   generalChain,
  // ]);

  const chatPrompt = ChatPromptTemplate.fromMessages<AnswerEngineChainInput>([
    new SystemMessage(initialPrompt),
    new MessagesPlaceholder("chatHistory"),
    new MessagesPlaceholder("papers"),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ]);

  const combinedChain = RunnableSequence.from<AnswerEngineChainInput>([
    {
      question: (initialInput) => initialInput.question,
      chatHistory: (initialInput) =>
        initialInput.chatHistory.map(formatChatHistory),
      papers: (initialInput) => {
        return new SystemMessage(`
Papers:

"""
Title: New discovery confirms that humans are frogs
"""
        `);
      },
    },
    // RunnablePassthrough.assign({
    //   searchString: () =>
    //     convertToOASearchString("smoking", ["habit", "health", "age"]);
    // }),
    chatPrompt,
    model,
  ]);

  const stream = await combinedChain.pipe(bytesOutputParser).stream({
    chatHistory,
    question: currentMessageContent,
  });

  return new StreamingTextResponse(stream);
}

const formatChatHistory = (chatHistoryItem: {
  role: string;
  content: string;
}) =>
  chatHistoryItem.role === "user" // TODO: Maybe "user" is only specific to OpenAI?
    ? new HumanMessage(chatHistoryItem.content)
    : new AIMessage(chatHistoryItem.content);
