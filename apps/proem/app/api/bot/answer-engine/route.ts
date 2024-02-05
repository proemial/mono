import { NextRequest } from "next/server";

import {
  AnswerEngineParams,
  askAnswerEngine,
} from "@/app/api/bot/answer-engine/answer-engine";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: AnswerEngineParams["chatHistory"] = body.messages ?? [];
  const chatHistory = messages.slice(0, -1);
  const question = messages[messages.length - 1]!.content;
  const sessionId = prettySlug(question);

  const stream = askAnswerEngine({
    question,
    chatHistory,
    sessionId,
  });

  return stream;
}

/**
 * Prettifies a random slug based on the user's question.
 * @example prettySlug("Hello World") //> "hello-world-<randomID>"
 */
function prettySlug(question: string) {
  return `${encodeURI(question.replaceAll(" ", "-")).substring(0, 12)}-${crypto
    .randomUUID()
    .replaceAll("-", "")
    .substring(0, 22)}`;
}
