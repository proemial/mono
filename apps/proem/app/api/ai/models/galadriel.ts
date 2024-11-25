import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";

// https://docs.galadriel.com/for-developers/models
type ModelId = "llama3.1:8b" | "llama3.1:70b" | "llama3.1:405b";

export const galadrielProvider = (modelId: ModelId): LanguageModelV1 =>
	createOpenAI({
		name: "galadriel",
		baseURL: "https://api.galadriel.com/v1",
		apiKey: process.env.GALADRIEL_API_KEY,
	})(modelId);
