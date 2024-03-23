import { AnthropicInput, ChatAnthropic } from "@langchain/anthropic";
import { Ollama, OllamaInput } from "@langchain/community/llms/ollama";
import { BaseChatModelParams } from "@langchain/core/language_models/chat_models";
import { BaseLLMParams } from "@langchain/core/language_models/llms";
import { AsyncCallerParams } from "@langchain/core/utils/async_caller";
import { ChatGroq, ChatGroqInput } from "@langchain/groq";
import { ChatMistralAI, ChatMistralAIInput } from "@langchain/mistralai";
import {
	AzureOpenAIInput,
	ChatOpenAI,
	OpenAIChatInput,
} from "@langchain/openai";
import { ClientOptions } from "openai/index.mjs";

/* Common model options */
type CommonModelOptions = AsyncCallerParams & {
	verbose: boolean;
	cache: boolean;
	temperature: number;
};
const IS_DEV_ENV = process.env.NODE_ENV === "development";
const COMMON_MODEL_DEFAULTS: CommonModelOptions = {
	verbose: IS_DEV_ENV ? true : false,
	cache: IS_DEV_ENV ? false : true,
	maxConcurrency: IS_DEV_ENV ? 1 : undefined,
	maxRetries: IS_DEV_ENV ? 0 : undefined,
	onFailedAttempt: (error) => {
		console.error(error);
	},
	temperature: 0.7,
};

/* OpenAI */
type OpenAIModelName =
	| "gpt-3.5-turbo-0125"
	| "gpt-4-0125-preview"
	| "text-embedding-3-small"
	| "text-embedding-3-large";
type OpenAIModelOptions = Partial<OpenAIChatInput> &
	Partial<AzureOpenAIInput> &
	BaseChatModelParams & {
		configuration?: ClientOptions;
	};
const OPENAI_ORGANIZATIONS = {
	ask: IS_DEV_ENV ? undefined : "org-aMpPztUAkETkCQYK6QhW25A4",
	read: IS_DEV_ENV ? undefined : "org-igYkjAypLUMGZ32zgikAg46E",
	summarization: IS_DEV_ENV ? undefined : "org-H6CcBBVdWURJ01YnJ0t9wZaH",
};
type OpenAIModelParams = OpenAIModelOptions & {
	modelName: OpenAIModelName;
	organization: keyof typeof OPENAI_ORGANIZATIONS | undefined; // Use `undefined` non-prod accounts
};

/* MistralAI */
type MistralAIModelName =
	| "mistral-small-2402"
	| "mistral-large-2402"
	| "open-mixtral-8x7b"
	| "mistral-embed";
type MistralAIModelOptions = ChatMistralAIInput;
type MistralAIModelParams = MistralAIModelOptions & {
	modelName: MistralAIModelName;
};

/* Anthropic */
type AnthropicModelName =
	| "claude-3-opus-20240229"
	| "claude-3-sonnet-20240229"
	| "claude-3-haiku-20240307"
	| "claude-2.1"
	| "claude-2.0"
	| "claude-instant-1.2";
type AnthropicModelOptions = Partial<AnthropicInput> & BaseChatModelParams;
type AnthropicModelParams = AnthropicModelOptions & {
	modelName: AnthropicModelName;
};

/* Groq */
type GroqModelName = "llama2-70b-4096" | "mixtral-8x7b-32768" | "gemma-7b-it";
type GroqModelOptions = ChatGroqInput;
type GroqModelParams = GroqModelOptions & {
	modelName: GroqModelName;
};

/* Ollama */
type OllamaModelName = "llama2" | "mistral"; // Models can be downloaded using `ollama pull <model>`
type OllamaModelOptions = OllamaInput & BaseLLMParams;
type OllamaModelParams = OllamaModelOptions & {
	modelName: OllamaModelName;
};

/* LM Studio */
type LMStudioModelName = "lmstudio-model"; // Load a model in LM Studio and start the server
type LMStudioModelOptions = OpenAIModelOptions;
type LMStudioModelParams = OpenAIModelOptions & {
	modelName: LMStudioModelName;
};

const MODEL_DEFAULTS: {
	openai: OpenAIModelOptions;
	mistralai: MistralAIModelOptions;
	anthropic: AnthropicModelOptions;
	groq: GroqModelOptions;
	ollama: OllamaModelOptions;
	lmstudio: LMStudioModelOptions;
} = {
	openai: {
		...COMMON_MODEL_DEFAULTS,
		openAIApiKey: process.env.OPENAI_API_KEY,
	},
	mistralai: {
		...COMMON_MODEL_DEFAULTS,
		apiKey: process.env.MISTRAL_API_KEY,
	},
	anthropic: {
		...COMMON_MODEL_DEFAULTS,
		anthropicApiKey: process.env.ANTHROPIC_API_KEY,
	},
	groq: {
		...COMMON_MODEL_DEFAULTS,
		apiKey: process.env.GROQ_API_KEY,
	},
	ollama: {
		...COMMON_MODEL_DEFAULTS,
		baseUrl: "http://localhost:11434",
	},
	lmstudio: {
		...COMMON_MODEL_DEFAULTS,
		openAIApiKey: "required-by-sdk",
		configuration: {
			baseURL: "http://localhost:1234/v1",
		},
	},
};

export const createModel = <T>(
	params:
		| OpenAIModelParams
		| MistralAIModelParams
		| AnthropicModelParams
		| GroqModelParams
		| OllamaModelParams
		| LMStudioModelParams,
) => {
	switch (params.modelName) {
		/* OpenAI */
		case "gpt-3.5-turbo-0125":
		case "gpt-4-0125-preview":
		case "text-embedding-3-small":
		case "text-embedding-3-large":
			return new ChatOpenAI({
				...MODEL_DEFAULTS.openai,
				...params,
				configuration: {
					...params.configuration,
					organization: params.organization,
				},
			}) as T;
		/* MistralAI */
		case "mistral-small-2402":
		case "mistral-large-2402":
		case "open-mixtral-8x7b":
		case "mistral-embed":
			return new ChatMistralAI({ ...MODEL_DEFAULTS.mistralai, ...params }) as T;
		/* Anthropic */
		case "claude-3-opus-20240229":
		case "claude-3-sonnet-20240229":
		case "claude-3-haiku-20240307":
		case "claude-2.1":
		case "claude-2.0":
		case "claude-instant-1.2":
			return new ChatAnthropic({ ...MODEL_DEFAULTS.anthropic, ...params }) as T;
		/* Groq */
		case "llama2-70b-4096":
		case "mixtral-8x7b-32768":
		case "gemma-7b-it":
			return new ChatGroq({ ...MODEL_DEFAULTS.groq, ...params }) as T;
		/* Ollama */
		case "llama2":
		case "mistral":
			return new Ollama({
				...MODEL_DEFAULTS.ollama,
				...params,
				model: params.modelName,
			}) as T;
		case "lmstudio-model":
			return new ChatOpenAI({ ...MODEL_DEFAULTS.lmstudio, ...params }) as T;
		default:
			throw new Error("Model is not supported.");
	}
};
