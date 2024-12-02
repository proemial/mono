import { LanguageModelV1 } from "ai";
import { createOllama } from "ollama-ai-provider";

type ModelId =
	| "llama3.1:8b"
	| "llama3.1:70b"
	| "llama3.2:1b"
	| "llama3.2:3b"
	| "llama3.2-vision:11b";

export const ollamaProvider = (modelId: ModelId): LanguageModelV1 =>
	createOllama({
		baseURL: "http://localhost:11434/api",
	})(modelId);
