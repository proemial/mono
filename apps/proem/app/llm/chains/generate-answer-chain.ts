import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as hub from "langchain/hub";

const hubPrompt = await hub.pull("proemial/ask-answer-prompt:130ba7cd");

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask");

export const generateAnswerChain = (modelOverride: BaseChatModel = model) =>
	hubPrompt
		.pipe(modelOverride)
		.pipe(new StringOutputParser())
		.withConfig({ runName: "GenerateAnswer" });
