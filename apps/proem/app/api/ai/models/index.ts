import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";

export type LlmModel =
	| ReturnType<typeof google>
	| ReturnType<typeof openai>
	| ReturnType<typeof anthropic>
	| ReturnType<typeof bedrock>;

const flash = google("gemini-1.5-flash");
const gpt4o = openai("gpt-4o");
const sonnet = anthropic("claude-3-5-sonnet-20240620");
const bedrockSonnet = bedrock("us.anthropic.claude-3-5-sonnet-20241022-v2:0");

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

function bedrock(modelId: string) {
	const awsBedrock = createAmazonBedrock({
		region: "us-east-1",
	});
	return awsBedrock(modelId) as ReturnType<typeof awsBedrock>;
}

function logModel(key: string, model: LlmModel) {
	console.log(`[${key}]: ${model.modelId}`);
	return model;
}

export default LlmModels;
