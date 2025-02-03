import { EmbeddingModel, LanguageModelV1 } from "ai";
import { createOllama } from "ollama-ai-provider";

type ChatModelId = "llama3.1:8b" | "bespoke-minicheck:7b";
type EmbeddingModelId = "nomic-embed-text:v1.5";

// export const remoteOllama = (
// 	modelId: ModelId,
// 	baseUrl: string,
// 	basicAuth: string,
// ): LanguageModelV1 =>
// 	createOpenAI({
// 		name: "remote-ollama",
// 		baseURL: `${baseUrl}/v1/`,
// 		apiKey: "not-needed",
// 		headers: {
// 			Authorization: `Basic ${Buffer.from(basicAuth).toString("base64")}`,
// 		},
// 	})(modelId);

export const remoteOllamaChatModel = (
	modelId: ChatModelId,
	baseUrl: string,
	basicAuth: string,
): LanguageModelV1 => remoteOllamaProvider(baseUrl, basicAuth).chat(modelId);

export const remoteOllamaEmbeddingModel = (
	modelId: EmbeddingModelId,
	baseUrl: string,
	basicAuth: string,
): EmbeddingModel<string> =>
	remoteOllamaProvider(baseUrl, basicAuth).embedding(modelId);

const remoteOllamaProvider = (baseUrl: string, basicAuth: string) =>
	createOllama({
		baseURL: `${baseUrl}/api/`,
		headers: {
			Authorization: `Basic ${Buffer.from(basicAuth).toString("base64")}`,
		},
	});
