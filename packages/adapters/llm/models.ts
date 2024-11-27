import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";

export type LlmModel = ReturnType<typeof openaiChat>;

export type EmbeddingsModel = OpenAI.Embeddings;

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
};

function getModel(
	project: keyof typeof openaiConfig.projects,
	operation: string,
	traceId?: string,
) {
	return openaiChat(project, operation, "gpt-4o", traceId) as LlmModel;
}

export const openaiConfig = {
	org: "org-aMpPztUAkETkCQYK6QhW25A4",
	projects: {
		default: "proj_mX23TYmhdJcPjnFy0sliSLwj",
		ask: "proj_UpT8sB3CWNtxqezfqm2AY8tZ",
		index: "proj_Pq2CtfZHHyVKJCo0slBwvwLy",
		news: "proj_91doOP0NSL4H24OS14TpCBtf",
		spaces: "proj_GKsXGiCSfpjvcCxLr2sUCmbf",
	},
};

const openaiChat = (
	project: keyof typeof openaiConfig.projects,
	operation: string,
	model: string,
	traceId?: string,
) => {
	console.log(
		`[llm][openai][chat][${project}]${operation ? `[${operation}]` : ""} ${model}`,
	);

	const heliconeHeaders = (traceId?: string): Record<string, string> => {
		const headers = {
			"Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
			"Helicone-Property-Project": project,
			"Helicone-Property-Operation": operation,
			"Helicone-Property-Environment": process.env.NODE_ENV || "production",
		};

		return traceId && ["ask", "news"].includes(project)
			? {
					...headers,
					"Helicone-Session-Id": traceId,
					"Helicone-Session-Name": `${project}: ${["background", "query"].includes(operation) ? "annotation" : "answer"}`,
					"Helicone-Session-Path": `${project}/${operation}`,
				}
			: headers;
	};

	const provider = createOpenAI({
		baseURL: "https://oai.helicone.ai/v1",
		headers: heliconeHeaders(traceId),
		// Passed on to OpenAI by Helicone
		apiKey: process.env.OPENAI_API_KEY || "",
		organization: openaiConfig.org,
		project: openaiConfig.projects[project],
		compatibility: "strict", // Required for usage to be streamed
	});

	return provider(model) as ReturnType<typeof provider>;
};

const openaiEmbeddings = (
	project: keyof typeof openaiConfig.projects,
	operation: string,
) => {
	console.log(
		`[llm][openai][embeddings][${project}]${operation ? `[${operation}]` : ""}`,
	);
	const provider = new OpenAI({
		// No Helicone for embeddings, as it is cheap and becomes noisy
		organization: openaiConfig.org,
		project: openaiConfig.projects[project],
	});

	return provider.embeddings;
};

export default LlmModels;
