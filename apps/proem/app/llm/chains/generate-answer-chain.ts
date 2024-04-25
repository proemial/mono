import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { PapersAsString } from "./fetch-papers/fetch-papers-chain";
import { askDigestibleAnswersPrompt } from "@/app/prompts/ask_digestible-answers";

type Input = {
	question: string;
	papers: PapersAsString;
};

const digestivePrompt = ChatPromptTemplate.fromMessages<Input>([
	["system", askDigestibleAnswersPrompt],
	["human", "Question: {question}\n\nResearch papers: {papers}"],
]);

const model = buildOpenAIChatModel("gpt-4-0125-preview", "ask");

export const generateAnswerChain = (modelOverride: BaseChatModel = model) =>
	RunnableLambda.from(async () => {
		return digestivePrompt
			.pipe(modelOverride)
			.pipe(new StringOutputParser())
			.withConfig({ runName: "GenerateAnswer" });
	});
