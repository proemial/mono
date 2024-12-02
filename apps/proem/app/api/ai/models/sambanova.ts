import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";

type ModelId =
	| "Meta-Llama-3.1-8B-Instruct"
	| "Meta-Llama-3.1-70B-Instruct"
	| "Meta-Llama-3.1-405B-Instruct"
	| "Meta-Llama-3.2-1B-Instruct"
	| "Meta-Llama-3.2-3B-Instruct"
	| "Llama-3.2-11B-Vision-Instruct"
	| "Llama-3.2-90B-Vision-Instruct";

/**
 * Note: The SambaNova API does not seem to support tool calls. :(
 */
export const sambanovaProvider = (modelId: ModelId): LanguageModelV1 =>
	createOpenAI({
		name: "sambanova",
		baseURL: "https://api.sambanova.ai/v1",
		apiKey: process.env.SAMBANOVA_API_KEY,
	})(modelId);
