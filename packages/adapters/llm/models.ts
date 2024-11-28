import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";

export type LlmModel = ReturnType<typeof openaiChat>;

export type EmbeddingsModel = OpenAI.Embeddings;

export type SourceProduct = "ask" | "news" | "spaces" | "embed";

const LlmModels = {
	ask: {
		embeddings: () => openaiEmbeddings("ask", "embeddings") as EmbeddingsModel,
		rephrase: (traceId?: string) =>
			getModel("ask", "rephrase", traceId) as LlmModel,
		answer: (traceId?: string) =>
			getModel("ask", "answer", traceId) as LlmModel,
		followups: (traceId?: string) =>
			getModel("ask", "followups", traceId) as LlmModel,
	},
	index: {
		embeddings: () =>
			openaiEmbeddings("index", "embeddings") as EmbeddingsModel,
	},
	news: {
		answer: (traceId?: string) =>
			getModel("news", "answer", traceId) as LlmModel,
		followups: (traceId?: string) =>
			getModel("news", "followups", traceId) as LlmModel,

		// Annotation
		query: (traceId?: string) => getModel("news", "query", traceId) as LlmModel,
		background: (traceId?: string) =>
			getModel("news", "background", traceId) as LlmModel,
	},
	assistant: {
		answer: (traceId?: string) =>
			getModel("spaces", "answer", traceId) as LlmModel,
	},
	read: {
		title: (source?: SourceProduct) =>
			getModel(source ?? "read", "paper:title") as LlmModel,
		description: (source?: SourceProduct) =>
			getModel(source ?? "read", "paper:description") as LlmModel,
		starters: (source?: SourceProduct) =>
			getModel(source ?? "read", "paper:starters") as LlmModel,
		related: (source?: SourceProduct) =>
			getModel(source ?? "read", "paper:related") as LlmModel,
	},
};

function getModel(
	source: keyof typeof llmConfig.sources,
	operation: string,
	traceId?: string,
) {
	const model = operation.includes("paper") ? "gpt-3.5-turbo-0125" : "gpt-4o";
	return openaiChat(source, operation, model, traceId) as LlmModel;
}

export const llmConfig = {
	org: "org-aMpPztUAkETkCQYK6QhW25A4",
	sources: {
		default: "proj_mX23TYmhdJcPjnFy0sliSLwj",
		ask: "proj_UpT8sB3CWNtxqezfqm2AY8tZ",
		index: "proj_Pq2CtfZHHyVKJCo0slBwvwLy",
		news: "proj_91doOP0NSL4H24OS14TpCBtf",
		spaces: "proj_GKsXGiCSfpjvcCxLr2sUCmbf",
		read: "proj_IC2HhSCTrkYccm2ry8Ub7f4L",
		embed: "proj_evqPpJ4bydRLaiNas3pa8WFe",
	},
};

const openaiChat = (
	source: keyof typeof llmConfig.sources,
	operation: string,
	model: string,
	traceId?: string,
) => {
	console.log(
		`[llm][openai][chat][${source}]${operation ? `[${operation}]` : ""} ${model}`,
	);

	const heliconeHeaders = (traceId?: string): Record<string, string> => {
		const headers = {
			"Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
			"Helicone-Property-Project": source,
			"Helicone-Property-Operation": operation,
			"Helicone-Property-Environment": process.env.NODE_ENV || "production",
		};

		return traceId
			? {
					...headers,
					"Helicone-Session-Id": traceId,
					"Helicone-Session-Name": `${source}: ${["background", "query"].includes(operation) ? "annotation" : "answer"}`,
					"Helicone-Session-Path": `${source}/${operation}`,
				}
			: headers;
	};

	const provider = createOpenAI({
		baseURL: "https://oai.helicone.ai/v1",
		headers: heliconeHeaders(traceId),
		// Passed on to OpenAI by Helicone
		apiKey: process.env.OPENAI_API_KEY || "",
		organization: llmConfig.org,
		project: llmConfig.sources[source],
		compatibility: "strict", // Required for usage to be streamed
	});

	return provider(model) as ReturnType<typeof provider>;
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

export default LlmModels;
