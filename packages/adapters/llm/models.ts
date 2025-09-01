import { createOpenAI, openai } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";
import OpenAI from "openai";

const DEFAULT_MODEL: OpenAIModelId = "gpt-4o";
const PAPER_MODEL: OpenAIModelId = "gpt-3.5-turbo-0125";

type OpenAIModelId = Parameters<typeof openai>[0];

export type EmbeddingsModel = OpenAI.Embeddings;

const LlmModels = {
	chat: {
		embeddings: () => openaiEmbeddings("chat", "embeddings") as EmbeddingsModel,
		answer: () => getModel("chat", "answer"),
		rephrase: () => getModel("chat", "rephrase"),
		followups: () => getModel("chat", "followups"),
		description: () => getModel("chat", "paper:description"),
		title: () => getModel("chat", "paper:title"),
	},
	index: {
		summarize: () => getModel("index", "summarize"),
		embeddings: () =>
			openaiEmbeddings("index", "embeddings") as EmbeddingsModel,
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
	org: "org-H6CcBBVdWURJ01YnJ0t9wZaH",
	sources: {
		default: "proj_lfurJ2XHjqgtbghbSmJIJFk2",
		chat: "proj_EPbn2RCF40KH2ju9AneODT6c",
		index: "proj_V5dAXcmwEkPj9m476Dw7gEui",
		read: "proj_nIdf91wGl5Z7swLWGlbvvQLn",
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

	const config = {
		apiKey:
			source === "chat"
				? process.env.OPENAI_API_KEY_CHAT
				: source === "index"
					? process.env.OPENAI_API_KEY_INDEX
					: process.env.OPENAI_API_KEY || "",
		organization: llmConfig.org,
		project: llmConfig.sources[source],
	};
	console.log(config);
	const provider = createOpenAI(config);

	return provider(model);
};

const openaiEmbeddings = (
	source: keyof typeof llmConfig.sources,
	operation: string,
) => {
	console.log(
		`[llm][openai][embeddings][${source}]${operation ? `[${operation}]` : ""}`,
	);

	const config = {
		apiKey:
			source === "chat"
				? process.env.OPENAI_API_KEY_CHAT
				: source === "index"
					? process.env.OPENAI_API_KEY_INDEX
					: process.env.OPENAI_API_KEY || "",
		organization: llmConfig.org,
		project: llmConfig.sources[source],
	};
	console.log(config);
	const provider = new OpenAI(config);

	return provider.embeddings;
};

export default LlmModels;
