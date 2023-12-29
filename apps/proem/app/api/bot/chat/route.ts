import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { Env } from "@proemial/utils/env";

const config = new Configuration({
  apiKey: Env.get("OPENAI_API_KEY"),
});
const openai = new OpenAIApi(config);

export const runtime = "edge";
const model = "gpt-4-1106-preview";

export async function POST(req: Request) {
  const { messages, title, abstract } = await req.json();

  const moddedMessages = [
    {
      role: "system",
      content:
        `Here is some context: title: ${title}, abstract: ${abstract}. ` +
        'For future reference, "core concepts" are considered short technical concepts and lingo relevant to the title and abstract.',
    },
    ...messages,
  ];
  const prompt = await chatPrompt(model);
  console.log(model, prompt);

  const lastMessage = moddedMessages.at(-1);
  if (lastMessage.role === "user") {
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

async function chatPrompt(
  model: "gpt-4-1106-preview" | "gpt-4" | "gpt-3.5-turbo",
) {
  return model === "gpt-3.5-turbo"
    ? "In a single sentence, "
    : 'In a single sentence enclosing "core concepts" with double parenthesis,';
}
