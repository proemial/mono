import { fetchPapersChain } from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
import {
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { LangChainChatHistoryMessage } from "../utils";
import { getGenerateAnswerChain } from "./generate-answer-chain";
import { getIdentifyIntentChain } from "./identify-intent-chain";

type Input = {
	question: string;
	chatHistory: LangChainChatHistoryMessage[];
	papers: { link: string; abstract: string; title: string }[] | undefined;
};
type Output = string;

export const answerEngineChain = RunnableSequence.from<Input, Output>([
	RunnablePassthrough.assign({
		intent: getIdentifyIntentChain(),
	}),
	RunnablePassthrough.assign({
		papers: (input) => {
			if (input.papers) {
				return JSON.stringify(input.papers);
			}
			return fetchPapersChain;
		},
	}),
	getGenerateAnswerChain(),
]).withConfig({
	runName: "AnswerEngine",
});
