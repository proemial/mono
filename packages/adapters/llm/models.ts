import { heliconeHeaders } from "../analytics/helicone";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";
import OpenAI from "openai";
import { embed } from "@nomic-ai/atlas";
import { ollama } from "ollama-ai-provider";
import { EnvVars } from "../../utils/env-vars";
import { google, createGoogleGenerativeAI } from "@ai-sdk/google";

const DEFAULT_MODEL: ModelId = "gpt-4o";
const PAPER_MODEL: ModelId = "gpt-3.5-turbo-0125";
const INTERNAL_MODEL: ModelId = "gemini-2.0-flash-001";

type OpenAIModelId = Parameters<typeof openai>[0];
type GoogleModelId = Parameters<typeof google>[0];
type ModelId = OpenAIModelId | GoogleModelId;

export type EmbeddingsModel = OpenAI.Embeddings;

export type SourceProduct =
	| "chat"
	| "ask"
	| "news"
	| "spaces"
	| "embed"
	| "api";

const LlmModels = {
	chat: {
		embeddings: () => openaiEmbeddings("ask", "embeddings") as EmbeddingsModel,
		answer: (traceId?: string) => getModel("chat", "answer", traceId),
		rephrase: (traceId?: string) => getModel("chat", "rephrase", traceId),
		followups: (traceId?: string) => getModel("chat", "followups", traceId),
	},
	ask: {
		embeddings: () => openaiEmbeddings("ask", "embeddings") as EmbeddingsModel,
		rephrase: (traceId?: string) => getModel("ask", "rephrase", traceId),
		answer: (traceId?: string) => getModel("ask", "answer", traceId),
		followups: (traceId?: string) => getModel("ask", "followups", traceId),
	},
	index: {
		embeddings: () =>
			openaiEmbeddings("index", "embeddings") as EmbeddingsModel,
	},
	api: {
		embeddings: () => nomicEmbeddings("api", "embeddings"),
		answer: () => ollama("llama3.1:8b"),
		similarityAnalysis: () => ollama("llama3.1:8b"),
		factChecking: () => ollama("bespoke-minicheck:7b"),
		summariseChannel: () => openai("gpt-4o"),
	},
	spaces: {
		answer: (traceId?: string) => getModel("spaces", "answer", traceId),
	},
	read: {
		title: (source?: SourceProduct) =>
			getModel(source ?? "read", "paper:title"),
		description: (source?: SourceProduct) =>
			getModel(source ?? "read", "paper:description"),
		starters: (source?: SourceProduct) =>
			getModel(source ?? "read", "paper:starters"),
		// related: (source?: SourceProduct) =>
		// 	getModel(source ?? "read", "paper:related"),
	},
	news: {
		answer: (traceId?: string) => getModel("news", "answer", traceId),
		followups: (traceId?: string) => getModel("news", "followups", traceId),

		// Annotation
		query: (traceId?: string) => getModel("news", "query", traceId),
		background: (traceId?: string) => getModel("news", "background", traceId),
	},
	assistant: {
		answer: (traceId?: string) =>
			googleChat("assistant", "answer", INTERNAL_MODEL, traceId),
		followups: (traceId?: string) =>
			googleChat("assistant", "followups", INTERNAL_MODEL, traceId),

		// Annotation
		query: (traceId?: string) =>
			googleChat("assistant", "query", INTERNAL_MODEL, traceId),
		background: (traceId?: string) =>
			googleChat("assistant", "background", INTERNAL_MODEL, traceId),
		embeddings: () =>
			openaiEmbeddings("index", "embeddings") as EmbeddingsModel,
	},
};

function getModel(
	source: keyof typeof llmConfig.sources,
	operation: string,
	traceId?: string,
) {
	if (operation.includes("paper")) {
		return openaiChat(source, operation, PAPER_MODEL, traceId);
	}
	return openaiChat(source, operation, DEFAULT_MODEL, traceId);
}

export const llmConfig = {
	org: "org-aMpPztUAkETkCQYK6QhW25A4",
	sources: {
		default: "proj_mX23TYmhdJcPjnFy0sliSLwj",
		chat: "proj_sqtkX7X2Xy5S0TEzHNomUILt",
		ask: "proj_UpT8sB3CWNtxqezfqm2AY8tZ",
		index: "proj_Pq2CtfZHHyVKJCo0slBwvwLy",
		news: "proj_91doOP0NSL4H24OS14TpCBtf",
		spaces: "proj_GKsXGiCSfpjvcCxLr2sUCmbf",
		read: "proj_IC2HhSCTrkYccm2ry8Ub7f4L",
		embed: "proj_evqPpJ4bydRLaiNas3pa8WFe",
		// TODO: Create openai project
		api: "proj_Pq2CtfZHHyVKJCo0slBwvwLy",
		assistant: "proj_Pq2CtfZHHyVKJCo0slBwvwLy",
	},
};

const openaiChat = async (
	source: keyof typeof llmConfig.sources,
	operation: string,
	model: OpenAIModelId,
	traceId?: string,
): Promise<LanguageModelV1> => {
	console.log(
		`[llm][openai][chat][${source}]${operation ? `[${operation}]` : ""} ${model}`,
	);

	const provider = createOpenAI({
		baseURL: `https://oai.${process.env.HELICONE_BASE_URL}`,
		headers: await heliconeHeaders({
			traceId,
			source,
			operation,
			sessionName: traceId
				? `${source}: ${["background", "query"].includes(operation) ? "annotation" : "answer"}`
				: undefined,
		}),
		// Passed on to OpenAI by Helicone
		apiKey: process.env.OPENAI_API_KEY || "",
		organization: llmConfig.org,
		compatibility: "strict", // Required for usage to be streamed
	});

	return provider(model);
};

const googleChat = async (
	source: keyof typeof llmConfig.sources,
	operation: string,
	model: GoogleModelId,
	traceId?: string,
): Promise<LanguageModelV1> => {
	console.log(
		`[llm][google][chat][${source}]${operation ? `[${operation}]` : ""} ${model}`,
	);

	const googleProvider = createGoogleGenerativeAI({
		apiKey: process.env.GOOGLE_API_KEY,
	});

	return googleProvider(model);
};

const openaiEmbeddings = (
	source: keyof typeof llmConfig.sources,
	operation: string,
) => {
	console.log(
		`[llm][openai][embeddings][${source}]${operation ? `[${operation}]` : ""}`,
	);
	const provider = new OpenAI({
		// No Helicone for embeddings, as it is cheap and becomes noisy
		organization: llmConfig.org,
		project: llmConfig.sources[source],
	});

	return provider.embeddings;
};

const nomicEmbeddings = (
	source: keyof typeof llmConfig.sources,
	operation: string,
) => {
	// console.log(
	// 	`[${new Date().toLocaleTimeString("en-GB", { hour12: false })}][llm][nomic][embeddings][${source}]${operation ? `[${operation}]` : ""}`,
	// );

	return async (
		text: string,
		model: "nomic-embed-text-v1" | "nomic-embed-text-v1.5",
	) => {
		return await embed(
			text,
			{
				model: model,
			},
			process.env.NOMIC_API_KEY,
		);
	};
};

export default LlmModels;
