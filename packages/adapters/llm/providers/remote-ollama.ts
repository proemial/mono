import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";

type ModelId = "llama3.1:8b" | "bespoke-minicheck:7b" | "nomic-embed-text:v1.5";

export const remoteOllamaProvider = (modelId: ModelId): LanguageModelV1 =>
	createOpenAI({
		name: "remote-ollama",
		baseURL: `${process.env.REMOTE_OLLAMA_BASE_URL}/v1/`,
		apiKey: "not-needed",
		headers: {
			Authorization: `Basic ${Buffer.from(process.env.REMOTE_OLLAMA_BASIC_AUTH as string).toString("base64")}`,
		},
	})(modelId);
