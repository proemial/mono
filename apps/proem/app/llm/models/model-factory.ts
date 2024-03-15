import { AnthropicInput, ChatAnthropic } from "@langchain/anthropic";
import { Ollama, OllamaInput } from "@langchain/community/llms/ollama";
import { BaseLanguageModelParams } from "@langchain/core/language_models/base";
import { BaseLangChainParams } from "@langchain/core/language_models/base";
import { AsyncCallerParams } from "@langchain/core/utils/async_caller";
import { ChatGroq, ChatGroqInput } from "@langchain/groq";
import { ChatMistralAI, ChatMistralAIInput } from "@langchain/mistralai";
import { ChatOpenAI, ClientOptions, OpenAIBaseInput } from "@langchain/openai";
import { Env } from "@proemial/utils/env";

/**
 * Add new providers, models, default configs and params here.
 */

type ModelProvider =
	| "openai"
	| "mistralai"
	| "ollama"
	| "groq"
	| "lmstudio"
	| "anthropic";

type OpenAIModelName =
	| "gpt-3.5-turbo-0125"
	| "gpt-4-0125-preview"
	| "text-embedding-3-small"
	| "text-embedding-3-large";
type MistralAIModelName =
	| "mistral-small-2402"
	| "mistral-large-2402"
	| "open-mixtral-8x7b"
	| "mistral-embed";
type OllamaModelName = "llama2" | "mistral"; // Models can be downloaded using `ollama pull <model>`
type GroqModelName = "llama2-70b-4096" | "mixtral-8x7b-32768" | "gemma-7b-it";
type LMStudioModelName = "loaded-model"; // Load a model in LM Studio and start the server
type AnthropicModelName =
	| "claude-3-opus-20240229"
	| "claude-3-sonnet-20240229"
	| "claude-3-haiku-20240307"
	| "claude-2.1"
	| "claude-2.0"
	| "claude-instant-1.2";

const OPENAI_ORGANIZATIONS = {
	ask: "org-aMpPztUAkETkCQYK6QhW25A4",
	read: "org-igYkjAypLUMGZ32zgikAg46E",
	summarization: "org-H6CcBBVdWURJ01YnJ0t9wZaH",
};

const API_KEY_OPENAI = Env.get("OPENAI_API_KEY");
const API_KEY_MISTRALAI = Env.get("MISTRAL_API_KEY");
const API_KEY_GROQ = Env.get("GROQ_API_KEY");
const API_KEY_ANTHROPIC = Env.get("ANTHROPIC_API_KEY");

type CommonModelOptions = AsyncCallerParams & {
	verbose: BaseLangChainParams["verbose"];
	cache: BaseLanguageModelParams["cache"];
};

const COMMON_MODEL_DEFAULTS: CommonModelOptions = {
	verbose: process.env.NODE_ENV === "development" ? true : false,
	cache: process.env.NODE_ENV === "development" ? false : true,
	maxConcurrency: process.env.NODE_ENV === "development" ? 1 : undefined,
	maxRetries: process.env.NODE_ENV === "development" ? 0 : undefined,
	onFailedAttempt: (error) => {
		console.error(error);
	},
};

type OpenAIModelOptions = CommonModelOptions & {
	openAIApiKey: OpenAIBaseInput["openAIApiKey"];
};

type MistralAIModelOptions = CommonModelOptions & {
	apiKey: ChatMistralAIInput["apiKey"];
};

type OllamaModelOptions = CommonModelOptions & {
	baseUrl: OllamaInput["baseUrl"];
};

type GroqModelOptions = CommonModelOptions & {
	apiKey: ChatGroqInput["apiKey"];
};

type LMStudioModelOptions = CommonModelOptions & {
	openAIApiKey: OpenAIBaseInput["openAIApiKey"];
	configuration: {
		baseURL: ClientOptions["baseURL"];
	};
};

type AnthropicModelOptions = CommonModelOptions & {
	anthropicApiKey: AnthropicInput["anthropicApiKey"];
};

type ModelOptions = Record<
	ModelProvider,
	| OpenAIModelOptions
	| MistralAIModelOptions
	| OllamaModelOptions
	| GroqModelOptions
	| LMStudioModelOptions
	| AnthropicModelOptions
>;

const MODEL_DEFAULTS: ModelOptions = {
	openai: {
		...COMMON_MODEL_DEFAULTS,
		openAIApiKey: API_KEY_OPENAI,
	},
	mistralai: {
		...COMMON_MODEL_DEFAULTS,
		apiKey: API_KEY_MISTRALAI,
	},
	ollama: {
		...COMMON_MODEL_DEFAULTS,
		baseUrl: "http://localhost:11434",
	},
	groq: {
		...COMMON_MODEL_DEFAULTS,
		apiKey: API_KEY_GROQ,
	},
	lmstudio: {
		...COMMON_MODEL_DEFAULTS,
		openAIApiKey: "required by sdk",
		configuration: {
			baseURL: "http://localhost:1234/v1",
		},
	},
	anthropic: {
		...COMMON_MODEL_DEFAULTS,
		anthropicApiKey: API_KEY_ANTHROPIC,
	},
};

type CommonModelParams = AsyncCallerParams & {
	modelName:
		| MistralAIModelName
		| OllamaModelName
		| GroqModelName
		| LMStudioModelName
		| AnthropicModelName;
	temperature?: number;
};

type OpenAIModelParams = AsyncCallerParams & {
	modelName: OpenAIModelName;
	organization: keyof typeof OPENAI_ORGANIZATIONS;
	temperature?: CommonModelParams["temperature"];
};

type ModelParams = CommonModelParams | OpenAIModelParams;

export const createModel = (params: ModelParams) => {
	switch (params.modelName) {
		case "gpt-3.5-turbo-0125":
		case "gpt-4-0125-preview":
		case "text-embedding-3-small":
		case "text-embedding-3-large":
			return new ChatOpenAI({ ...MODEL_DEFAULTS.openai, ...params });
		// TODO: Fix "exported variable cannot be named" error
		// case "mistral-small-2402":
		// case "mistral-large-2402":
		// case "open-mixtral-8x7b":
		// case "mistral-embed":
		// 	return new ChatMistralAI({ ...MODEL_DEFAULTS.mistralai, ...params });
		// case "llama2":
		// case "mistral":
		// 	return new Ollama({ ...MODEL_DEFAULTS.ollama, ...params });
		case "llama2-70b-4096":
		case "mixtral-8x7b-32768":
		case "gemma-7b-it":
			return new ChatGroq({ ...MODEL_DEFAULTS.groq, ...params });
		case "loaded-model":
			return new ChatOpenAI({ ...MODEL_DEFAULTS.lmstudio, ...params });
		// case "claude-3-opus-20240229":
		// case "claude-3-sonnet-20240229":
		// case "claude-3-haiku-20240307":
		// case "claude-2.1":
		// case "claude-2.0":
		// case "claude-instant-1.2":
		// 	return new ChatAnthropic({ ...MODEL_DEFAULTS.anthropic, ...params });
		default:
			throw new Error("Model is not supported.");
	}
};
