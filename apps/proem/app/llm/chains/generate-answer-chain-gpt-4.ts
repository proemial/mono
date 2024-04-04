import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as hub from "langchain/hub";

const hubPrompt = await hub.pull("proemial/ask-answer-prompt:130ba7cd");

const model = buildOpenAIChatModel("gpt-4-0125-preview", "ask");

const stringOutputParser = new StringOutputParser();

export const getGenerateAnswerChainGpt4 = (
	modelOverride: BaseChatModel = model,
) =>
	hubPrompt
		.pipe(modelOverride)
		.pipe(stringOutputParser)
		.withConfig({ runName: "GenerateAnswer" });
