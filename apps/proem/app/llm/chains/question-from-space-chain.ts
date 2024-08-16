import {
	fetchPapersChain
} from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	ChatPromptTemplate,
} from "@langchain/core/prompts";
import {
	RunnableLambda,
	RunnablePassthrough,
	RunnableSequence
} from "@langchain/core/runnables";
import { buildOpenAIChatModel } from "../models/openai-model";
import { reRankAndLimit } from "./answer-engine-chain";

type Input = {
	title: string;
	description: string;
	prompt: string;
};

const prompt = ChatPromptTemplate.fromMessages<Input>([
	["system", `{prompt}`],
	["human", "Title: {title}, Description: {description}"],
]);

const model = buildOpenAIChatModel("gpt-4-0125-preview", "ask");

const questionFromSpaceChain = (modelOverride: BaseChatModel = model) =>
	prompt.pipe(modelOverride).pipe(new StringOutputParser());

export const findPapersForSpaceChain = RunnableLambda.from(async () => {
	return RunnableSequence.from<Input, any>([
		RunnablePassthrough.assign({
			// Note: This overwrites the original question
			question: questionFromSpaceChain(),
		}),
		RunnablePassthrough.assign({
			papers: fetchPapersChain,
		}),
		reRankAndLimit
	]);
}).withConfig({
	runName: "PapersForSpace",
});
