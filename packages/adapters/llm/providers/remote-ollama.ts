import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";

type ModelId = "llama3.1:8b" | "bespoke-minicheck:7b" | "nomic-embed-text:v1.5";

export const remoteOllamaProvider = (modelId: ModelId): LanguageModelV1 =>
	createOpenAI({
		name: "remote-ollama",
		baseURL: "https://938d-3-79-191-85.ngrok-free.app/v1/",
		apiKey: "not-needed",
		headers: {
			Authorization: `Basic ${Buffer.from("jon:proemial").toString("base64")}`,
		},
	})(modelId);
