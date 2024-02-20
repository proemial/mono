import { ChatOpenAI } from "@langchain/openai";
import { Env } from "@proemial/utils/env";

// Source: https://platform.openai.com/docs/models/overview
type OpenAIModel =
  | "gpt-4-0125-preview"   // Context window: 128,000 | Training data: Up to Dec 2023
  | "gpt-4-1106-preview"   // Context window: 128,000 | Training data: Up to Apr 2023
  | "gpt-4-0613"           // Context window:   8,192 | Training data: Up to Sep 2021
  | "gpt-3.5-turbo-0125"   // Context window:  16,385 | Training data: Up to Sep 2021
  | "gpt-3.5-turbo-1106";  // Context window:  16,385 | Training data: Up to Sep 2021

type OpenAIModelOptions = {
  temperature?: number;
  verbose?: boolean;
  cache?: boolean
};

const openAIApiKey = Env.get("OPENAI_API_KEY");
const openaiOrganizations = {
  ask: "org-aMpPztUAkETkCQYK6QhW25A4",
  read: "org-igYkjAypLUMGZ32zgikAg46E",
  summarization: "org-H6CcBBVdWURJ01YnJ0t9wZaH",
};

export const buildOpenAIChatModel = (
  modelName: OpenAIModel,
  organization: keyof typeof openaiOrganizations,
  options?: OpenAIModelOptions,
) =>
  new ChatOpenAI(
    {
      openAIApiKey,
      modelName: modelName,
      temperature: options?.temperature ?? 0.8, // TODO: Set default to `0` once we have evaluations
      cache: options?.cache ?? true,
      verbose: options?.verbose ?? false,
    },
    { organization: openaiOrganizations[organization] },
  );
