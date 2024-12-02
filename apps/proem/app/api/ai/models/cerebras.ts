import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";

type ModelId = "llama3.1-8b" | "llama3.1-70b";

export const cerebrasProvider = (modelId: ModelId): LanguageModelV1 =>
	createOpenAI({
		name: "cerebras",
		baseURL: "https://api.cerebras.ai/v1",
		apiKey: process.env.CEREBRAS_API_KEY,
	})(modelId);
