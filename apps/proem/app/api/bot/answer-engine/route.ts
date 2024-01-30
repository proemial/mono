import { NextRequest } from "next/server";

import {
  AnswerEngineParams,
  askAnswerEngine,
} from "@/app/api/bot/answer-engine/answer-engine";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: AnswerEngineParams["chatHistory"] = body.messages ?? [];
  const chatHistory = messages.slice(0, -1);
  const question = messages[messages.length - 1]!.content;

  return askAnswerEngine({ question, chatHistory });
}
