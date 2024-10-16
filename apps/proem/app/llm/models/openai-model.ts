import { openaiOrganizations } from "@proemial/adapters/llm/prompts/openai-keys";
import { BaseChatModelParams } from "@langchain/core/language_models/chat_models";
import {
	AzureOpenAIInput,
	ChatOpenAI,
	OpenAIChatInput,
} from "@langchain/openai";
import { ClientOptions } from "openai/index.mjs";
import { COMMON_MODEL_DEFAULTS } from "./model-options";

// Source: https://platform.openai.com/docs/models/overview
type OpenAIModel =
	| "gpt-4o"
	| "gpt-4-0125-preview" // Context window: 128,000 | Training data: Up to Dec 2023
	| "gpt-3.5-turbo-0125"; // Context window:  16,385 | Training data: Up to Sep 2021

export const buildOpenAIChatModel = (
	modelName: OpenAIModel,
	organization: keyof typeof openaiOrganizations | "none",
	options?: Partial<OpenAIChatInput> &
		Partial<AzureOpenAIInput> &
		BaseChatModelParams & {
			configuration?: ClientOptions;
		},
) =>
	new ChatOpenAI({
		...COMMON_MODEL_DEFAULTS,
		...options,
		configuration: {
			...options?.configuration,
			organization:
				organization === "none"
					? options?.configuration?.organization
					: openaiOrganizations[organization],
		},
		modelName,
	});
