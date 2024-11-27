import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";

export type LlmModel = ReturnType<typeof openaiChat>;

export type EmbeddingsModel = OpenAI.Embeddings;

const LlmModels = {
	ask: {
		embeddings: () => openaiEmbeddings("ask", "embeddings") as EmbeddingsModel,
		rephrase: (id?: string) => getModel("ask", "rephrase", id) as LlmModel,
		answer: (id?: string) => getModel("ask", "answer", id) as LlmModel,
		followups: (id?: string) => getModel("ask", "followups", id) as LlmModel,
		summarisePapers: (id?: string) =>
			getModel("ask", "summarisePapers", id) as LlmModel,
	},
	index: {
		embeddings: () =>
			openaiEmbeddings("index", "embeddings") as EmbeddingsModel,
	},
	news: {
		embeddings: () => openaiEmbeddings("news", "embeddings") as EmbeddingsModel,
		rephrase: (id?: string) => getModel("news", "rephrase", id) as LlmModel,
		answer: (id?: string) => getModel("news", "answer", id) as LlmModel,
		followups: (id?: string) => getModel("news", "followups", id) as LlmModel,
		summarisePapers: (id?: string) =>
			getModel("news", "summarisePapers", id) as LlmModel,
		summariseBackground: (id?: string) =>
			getModel("news", "summariseBackground", id) as LlmModel,
	},
	assistant: {
		answer: (id?: string) => getModel("spaces", "answer", id) as LlmModel,
	},
};

function getModel(
	project: keyof typeof openaiConfig.projects,
	operation: string,
	id?: string,
) {
	return openaiChat(project, operation, "gpt-4o", id) as LlmModel;
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
	id?: string,
) => {
	console.log(
		`[llm][openai][chat][${project}]${operation ? `[${operation}]` : ""} ${model}`,
	);

	const heliconeHeaders = (id?: string): Record<string, string> => {
		const headers = {
			"Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
			"Helicone-Property-Project": project,
			"Helicone-Property-Operation": operation,
			"Helicone-Property-Environment": process.env.NODE_ENV || "production",
		};

		return id && ["ask", "news"].includes(project)
			? {
					...headers,
					"Helicone-Session-Id": id,
					"Helicone-Session-Name": `${project}: answer`,
					"Helicone-Session-Path": `${project}/${operation}`,
				}
			: headers;
	};

	const provider = createOpenAI({
		baseURL: "https://oai.helicone.ai/v1",
		headers: heliconeHeaders(id),
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
