import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaInput } from "@langchain/community/llms/ollama";
import { BaseChatModelParams } from "@langchain/core/language_models/chat_models";
import { COMMON_MODEL_DEFAULTS } from "./model-options";

// Models must be downloaded first. E.g. using `ollama pull llama2`.
type OllamaModel = "llama3" | "llama2" | "mistral";

export const buildOllamaChatModel = (
	modelName: OllamaModel,
	options?: OllamaInput & BaseChatModelParams,
) =>
	new ChatOllama({
		...COMMON_MODEL_DEFAULTS,
		baseUrl: "http://localhost:11434",
		...options,
		model: modelName,
	});
