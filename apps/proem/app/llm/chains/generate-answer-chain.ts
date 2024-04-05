import { getFeatureFlag } from "@/app/components/feature-flags/server-flags";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import * as hub from "langchain/hub";
import { PapersAsString } from "./fetch-papers/fetch-papers-chain";
import { askDigestibleAnswersPrompt } from "@/app/prompts/ask_digestible-answers";

const hubPrompt = await hub.pull("proemial/ask-answer-prompt:130ba7cd");

type Input = {
	question: string;
	papers: PapersAsString;
};

const digestivePrompt = ChatPromptTemplate.fromMessages<Input>([
	["system", askDigestibleAnswersPrompt],
	["human", "Question: {question}\n\nResearch papers: {papers}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask");

export const generateAnswerChain = (modelOverride: BaseChatModel = model) =>
	RunnableLambda.from(async () => {
		const isDigestibleAnswersEnabled =
			await getFeatureFlag("digestibleAnswers");
		const prompt = isDigestibleAnswersEnabled ? digestivePrompt : hubPrompt;
		return prompt
			.pipe(modelOverride)
			.pipe(new StringOutputParser())
			.withConfig({ runName: "GenerateAnswer" });
	});
