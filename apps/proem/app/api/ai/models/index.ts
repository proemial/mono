import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export type LlmModel =
	| ReturnType<typeof google>
	| ReturnType<typeof openai>
	| ReturnType<typeof anthropic>;

const flash = google("gemini-1.5-flash");
const gpt4o = openai("gpt-4o");
const sonnet = anthropic("claude-3-5-sonnet-latest");

const defaultModel = gpt4o;
const answersModel = sonnet;

const LlmModels = {
	ask: {
		rephrase: () => logModel("ask.rephrase", defaultModel) as LlmModel,
		answer: () => logModel("ask.answer", answersModel) as LlmModel,
		followups: () => logModel("ask.followups", defaultModel) as LlmModel,
	},
	news: {
		rephrase: () => logModel("news.rephrase", defaultModel) as LlmModel,
		summarise: () => logModel("news.summarise", answersModel) as LlmModel,
		answer: () => logModel("news.answer", answersModel) as LlmModel,
		followups: () => logModel("news.followups", defaultModel) as LlmModel,
	},
	assistant: {
		answer: () => logModel("assistant.answer", answersModel) as LlmModel,
	},
};

function logModel(key: string, model: LlmModel) {
	console.log(`[${key}]: ${model.modelId}`);
	return model;
}

export default LlmModels;
