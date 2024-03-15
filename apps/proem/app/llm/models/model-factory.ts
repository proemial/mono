import { Ollama, OllamaInput } from "@langchain/community/llms/ollama";
import { BaseLanguageModelParams } from "@langchain/core/language_models/base";
import { BaseLangChainParams } from "@langchain/core/language_models/base";
import { ChatGroq, ChatGroqInput } from "@langchain/groq";
import { ChatMistralAI, ChatMistralAIInput } from "@langchain/mistralai";
import { ChatOpenAI, ClientOptions, OpenAIBaseInput } from "@langchain/openai";
import { Env } from "@proemial/utils/env";

type ModelProvider = "openai" | "mistralai" | "ollama" | "groq" | "lmstudio";

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

const OPENAI_ORGANIZATIONS = {
	ask: "org-aMpPztUAkETkCQYK6QhW25A4",
	read: "org-igYkjAypLUMGZ32zgikAg46E",
	summarization: "org-H6CcBBVdWURJ01YnJ0t9wZaH",
};

const API_KEY_OPENAI = Env.get("OPENAI_API_KEY");
const API_KEY_MISTRALAI = Env.get("MISTRAL_API_KEY");
const API_KEY_GROQ = Env.get("GROQ_API_KEY");

type CommonModelOptions = {
	verbose: BaseLangChainParams["verbose"];
	cache: BaseLanguageModelParams["cache"];
};

const COMMON_MODEL_DEFAULTS: CommonModelOptions = {
	verbose: process.env.NODE_ENV === "development" ? true : false,
	cache: process.env.NODE_ENV === "development" ? false : true,
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

type ModelOptions = Record<
	ModelProvider,
	| OpenAIModelOptions
	| MistralAIModelOptions
	| OllamaModelOptions
	| GroqModelOptions
	| LMStudioModelOptions
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
};

type CommonModelParams = {
	modelName:
		| MistralAIModelName
		| OllamaModelName
		| GroqModelName
		| LMStudioModelName;
	temperature?: number;
};

type OpenAIModelParams = {
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
		case "llama2":
		case "mistral":
			return new Ollama({ ...MODEL_DEFAULTS.ollama, ...params });
		case "llama2-70b-4096":
		case "mixtral-8x7b-32768":
		case "gemma-7b-it":
			return new ChatGroq({ ...MODEL_DEFAULTS.groq, ...params });
		case "loaded-model":
			return new ChatOpenAI({ ...MODEL_DEFAULTS.lmstudio, ...params });
	}
};
