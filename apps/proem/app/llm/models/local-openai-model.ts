import { ChatOpenAI } from "@langchain/openai";
import { ModelOptions } from "./model-options";

const localProviderBaseURL = {
	LMStudio: "http://localhost:1234/v1",
};

export const buildLocalOpenAIModel = (
	provider: keyof typeof localProviderBaseURL,
	options?: ModelOptions,
) =>
	new ChatOpenAI({
		openAIApiKey: "not-needed-but-required-by-sdk",
		modelName: "local-loaded-model",
		temperature: options?.temperature ?? 0.0,
		cache: options?.cache ?? false,
		verbose: options?.verbose ?? true,
		maxRetries: 0,
		configuration: {
			baseURL: localProviderBaseURL[provider],
		},
		onFailedAttempt: (error) => {
			console.error(error);
		},
	});
