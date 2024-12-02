import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";

// https://console.groq.com/docs/models
type ModelId =
	| "llama-3.1-8b-instant"
	| "llama-3.1-70b-versatile"
	| "llama-3.2-3b-preview"
	| "llama-3.2-90b-vision-preview";

export const groqProvider = (modelId: ModelId): LanguageModelV1 =>
	createOpenAI({
		name: "groq",
		baseURL: "https://api.groq.com/openai/v1",
		apiKey: process.env.GROQ_API_KEY,
	})(modelId);
