import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";

// https://console.groq.com/docs/models
// All models have context window of 128k tokens
type ModelId =
	| "llama-3.3-70b-versatile" // Max output tokens: 32,768 (others have 8,192)
	| "llama-3.1-8b-instant"
	| "llama-3.2-3b-preview"
	| "llama-3.2-1b-preview";

export const groqProvider = (modelId: ModelId): LanguageModelV1 =>
	createOpenAI({
		name: "groq",
		baseURL: "https://api.groq.com/openai/v1",
		apiKey: process.env.GROQ_API_KEY,
	})(modelId);
