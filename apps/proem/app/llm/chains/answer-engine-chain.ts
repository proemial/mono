import { fetchPapersChain } from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
import {
	RunnableMap,
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

type FetchPapersInput = Input & {
	intent: string;
};
type FetchPapersOutput = {
	question: string;
	chatHistory: LangChainChatHistoryMessage[];
	papers: string;
};

export const answerEngineChain = RunnableSequence.from<Input, Output>([
	RunnablePassthrough.assign({
		intent: getIdentifyIntentChain(),
	}),
	RunnableMap.from<FetchPapersInput, FetchPapersOutput>({
		question: (input) => input.question,
		chatHistory: (input) => input.chatHistory,
		papers: (input) => {
			if (input.papers) {
				return JSON.stringify(input.papers);
			}
			// TODO: Handle thrown errors.
			return fetchPapersChain as unknown as string;
		},
	}).withConfig({
		runName: "FetchPapers",
	}),
	getGenerateAnswerChain(),
]).withConfig({
	runName: "AnswerEngine",
});
