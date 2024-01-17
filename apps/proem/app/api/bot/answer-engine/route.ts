import { NextRequest } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { scienceAnswersGPTPrompt } from "@/app/prompts/science-answers-gpt";
import { question } from "@/app/prompts/chat";

export const runtime = "edge";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

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
  const currentMessageContent = messages[messages.length - 1].content;

  /**
   * See a full list of supported models at:
   * https://js.langchain.com/docs/modules/model_io/models/
   */
  const model = new ChatOpenAI({
    temperature: 0.8,
  });

  /**
   * Chat models stream message chunks rather than bytes, so this
   * output parser handles serialization and encoding.
   */
  const outputParser = new BytesOutputParser();
  const prompt1 = PromptTemplate.fromTemplate(
    `What is the city {person} is from? Only respond with the name of the city.`
  );
  const prompt2 = PromptTemplate.fromTemplate(
    `What country is the city {city} in? Respond in {language}.`
  );

  const chain2 = prompt1.pipe(model).pipe(new StringOutputParser());

  const combinedChain = RunnableSequence.from([
    {
      city: chain2,
      language: (input) => input.language,
    },
    prompt2,
    model,
    new StringOutputParser(),
  ]);

  const chain = RunnableSequence.from([
    scienceAnswersGPTPrompt,
    model,
    outputParser,
  ]);

  const stream = await combinedChain.stream({
    // chat_history: formattedPreviousMessages.join("\n"),
    // input: currentMessageContent,
    person: "Obama",
    language: "English",
  });

  return new StreamingTextResponse(stream);
}
