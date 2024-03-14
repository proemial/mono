import { Ollama } from "@langchain/community/llms/ollama";
import { LocalModelOptions, ModelOptions } from "./model-options";

// Models must be downloaded first. E.g. using `ollama pull llama2`.
type OllamaModel = "llama2";

export const getOllamaModel = (
	modelName: OllamaModel,
	options?: ModelOptions & LocalModelOptions,
) =>
	new Ollama({
		baseUrl: options?.baseUrl ?? "http://localhost:11434",
		model: modelName,
		verbose: options?.verbose ?? true,
		cache: options?.cache ?? false,
		temperature: options?.temperature ?? 0.0,
	});
