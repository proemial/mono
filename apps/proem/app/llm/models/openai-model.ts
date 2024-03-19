import { openAIApiKey, openaiOrganizations } from "@/app/prompts/openai-keys";
import { ChatOpenAI } from "@langchain/openai";
import { ModelOptions } from "./model-options";

// Source: https://platform.openai.com/docs/models/overview
type OpenAIModel =
	| "gpt-4-0125-preview" // Context window: 128,000 | Training data: Up to Dec 2023
	| "gpt-4-1106-preview" // Context window: 128,000 | Training data: Up to Apr 2023
	| "gpt-4-0613" // Context window:   8,192 | Training data: Up to Sep 2021
	| "gpt-3.5-turbo-0125" // Context window:  16,385 | Training data: Up to Sep 2021
	| "gpt-3.5-turbo-1106"; // Context window:  16,385 | Training data: Up to Sep 2021

export const buildOpenAIChatModel = (
	modelName: OpenAIModel,
	organization: keyof typeof openaiOrganizations,
	options?: ModelOptions,
) =>
	new ChatOpenAI({
		openAIApiKey,
		modelName: modelName,
		temperature: options?.temperature ?? 0.8, // TODO: Set default to `0` once we have a baseline
		cache: options?.cache ?? true,
		verbose: options?.verbose ?? false,
		configuration: {
			organization: openaiOrganizations[organization],
		},
		onFailedAttempt: (error) => {
			console.error(error);
		},
	});

export const buildOpenAIModelForEvaluation = (
	modelName: OpenAIModel,
	temperature?: number,
) =>
	new ChatOpenAI({
		openAIApiKey: process.env.OPENAI_API_KEY_TEST,
		modelName,
		temperature: temperature ?? 0.8, // TODO: Set default to `0` once we have a baseline
		cache: false,
		verbose: true,
		maxRetries: 0,
		maxConcurrency: 1, // We get throttled by OpenAI if we set concurrency higher than 1
		onFailedAttempt: (error) => {
			console.error(error);
		},
	});
