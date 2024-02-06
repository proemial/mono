import { ChatOpenAI } from "langchain/chat_models/openai";
import { organizations } from "@/app/prompts/openai-keys";

export const model = new ChatOpenAI(
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
