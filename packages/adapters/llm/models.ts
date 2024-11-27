import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";
// import { anthropic } from "@ai-sdk/anthropic";
// import { google } from "@ai-sdk/google";
// import { mistral } from "@ai-sdk/mistral";
// import { galadrielProvider } from "./galadriel";

export type LlmModel =
	// | ReturnType<typeof google>
	// | ReturnType<typeof anthropic>
	// | ReturnType<typeof mistral>
	ReturnType<typeof openaiChat>;

export type EmbeddingsModel = OpenAI.Embeddings;

// const flash = google("gemini-1.5-flash");;
// const sonnet = anthropic("claude-3-5-sonnet-20240620");
// const haiku = anthropic("claude-3-5-haiku-latest");
// const mist = mistral("mistral-large-latest");
// const galadrielLlama3_1 = galadrielProvider("llama3.1:405b");

const LlmModels = {
	ask: {
		embeddings: () => openaiEmbeddings("ask", "embeddings") as EmbeddingsModel,
		rephrase: () => getChatModel("ask", "rephrase") as LlmModel,
		answer: () => getChatModel("ask", "answer") as LlmModel,
		followups: () => getChatModel("ask", "followups") as LlmModel,
		summarisePapers: () => getChatModel("ask", "summarisePapers") as LlmModel,
	},
	index: {
		embeddings: () =>
			openaiEmbeddings("index", "embeddings") as EmbeddingsModel,
	},
	news: {
		embeddings: () => openaiEmbeddings("news", "embeddings") as EmbeddingsModel,
		rephrase: () => getChatModel("news", "rephrase") as LlmModel,
		answer: () => getChatModel("news", "answer") as LlmModel,
		followups: () => getChatModel("news", "followups") as LlmModel,
		summarisePapers: () => getChatModel("news", "summarisePapers") as LlmModel,
		summariseBackground: () =>
			getChatModel("news", "summariseBackground") as LlmModel,
	},
	assistant: {
		answer: () => getChatModel("spaces", "answer") as LlmModel,
	},
};

function getChatModel(
	project: keyof typeof openaiConfig.projects,
	operation: string,
) {
	return openaiChat(project, operation, "gpt-4o") as LlmModel;
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

const heliconeConfig = (
	project: keyof typeof openaiConfig.projects,
	operation: string,
) => ({
	baseURL: "https://oai.helicone.ai/v1",
	defaultHeaders: {
		"Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
		"Helicone-Property-Project": project,
		"Helicone-Property-Operation": operation,
		"Helicone-Property-Environment": process.env.NODE_ENV || "production",
	},
	// Passed on to OpenAI by Helicone
	apiKey: process.env.OPENAI_API_KEY,
	organization: openaiConfig.org,
	project: openaiConfig.projects[project],
});

const openaiChat = (
	project: keyof typeof openaiConfig.projects,
	operation: string,
	model: string,
) => {
	console.log(
		`[llm][openai][chat][${project}]${operation ? `[${operation}]` : ""} ${model}`,
	);
	const provider = createOpenAI({
		...heliconeConfig(project, operation),
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
		...heliconeConfig(project, operation),
	});

	return provider.embeddings;
};

export default LlmModels;
