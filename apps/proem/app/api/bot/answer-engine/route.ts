import { NextRequest } from "next/server";

import {
  AnswerEngineParams,
  askAnswerEngine,
} from "@/app/api/bot/answer-engine/answer-engine";

export async function POST(req: NextRequest) {
  const { messages = [], slug } = await req.json();
  // const messages: AnswerEngineParams["chatHistory"] = body.messages ?? [];
  const chatHistory = messages.slice(0, -1);
  const question = messages[messages.length - 1]!.content;

  const stream = askAnswerEngine({
    question,
    chatHistory,
    existingSlug: slug,
  });

  return stream;
}
