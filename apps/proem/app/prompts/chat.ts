import { Env } from "@proemial/utils/env";

export const apiKey = Env.get("OPENAI_API_KEY");
// Explicitly use the `Proemial Bot organisation, instead of the default `Proemial Summarisation`
export const organization = "org-igYkjAypLUMGZ32zgikAg46E";

export const model = "gpt-4-1106-preview";

type SupportedModels = "gpt-4-1106-preview" | "gpt-4" | "gpt-3.5-turbo";

export function context(title: string, abstract: string) {
  return {
    role: "system",
    content:
      `Here is some context: title: ${title}, abstract: ${abstract}. ` +
      'For future reference, "core concepts" are considered short technical concepts and lingo relevant to the title and abstract.',
  };
}

export async function question(model: SupportedModels) {
  return model === "gpt-3.5-turbo"
    ? "In a single sentence, "
    : 'In a single sentence enclosing "core concepts" with double parenthesis,';
}
