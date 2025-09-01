import { createOpenAI, openai } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";
import OpenAI from "openai";

const DEFAULT_MODEL: OpenAIModelId = "gpt-4o";
const PAPER_MODEL: OpenAIModelId = "gpt-3.5-turbo-0125";

type OpenAIModelId = Parameters<typeof openai>[0];

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
		answer: () => getModel("chat", "answer"),
		rephrase: () => getModel("chat", "rephrase"),
		followups: () => getModel("chat", "followups"),
	},
	index: {
		summarize: () => getModel("index", "summarize"),
		embeddings: () =>
			openaiEmbeddings("index", "embeddings") as EmbeddingsModel,
	},
	read: {
		title: (source?: SourceProduct) =>
			getModel(source ?? "read", "paper:title"),
		description: (source?: SourceProduct) =>
			getModel(source ?? "read", "paper:description"),
		starters: (source?: SourceProduct) =>
			getModel(source ?? "read", "paper:starters"),
	},
};

function getModel(
	source: keyof typeof llmConfig.sources,
	operation: string,
) {
	if (operation.includes("paper")) {
		return openaiChat(source, operation, PAPER_MODEL);
	}
	return openaiChat(source, operation, DEFAULT_MODEL);
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
): Promise<LanguageModelV1> => {
	console.log(
		`[llm][openai][chat][${source}]${operation ? `[${operation}]` : ""} ${model}`,
	);

	const provider = createOpenAI({
		apiKey: process.env.OPENAI_API_KEY || "",
	});

	return provider(model);
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
		// organization: llmConfig.org,
		// project: llmConfig.sources[source],
	});

	return provider.embeddings;
};

export default LlmModels;
