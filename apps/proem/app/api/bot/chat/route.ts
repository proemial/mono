import { NextRequest } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import {
  context,
  question,
  model,
  apiKey,
  organization,
} from "@/app/prompts/chat";

const config = new Configuration({ apiKey, organization });
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages, title, abstract } = await req.json();

  const moddedMessages = [context(title, abstract), ...messages];
  const prompt = await question(model);

  const lastMessage = moddedMessages.at(-1);
  if (lastMessage.role === "user") {
    // TODO: Why does is start with `!!`?
    if (!lastMessage.content.startsWith("!!"))
      lastMessage.content = `${prompt} ${lastMessage.content}`;
    else lastMessage.content = lastMessage.content.substring(2); // Remove the `!!`
  }

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model,
    stream: true,
    messages: moddedMessages,
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
