import { fetchPapersChain } from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
import { RunnableMap, RunnableSequence } from "@langchain/core/runnables";
import { LangChainChatHistoryMessage } from "../utils";
import { getGenerateAnswerChain } from "./generate-answer-chain";

type Input = {
	question: string;
	chatHistory: LangChainChatHistoryMessage[];
	papers: { link: string; abstract: string; title: string }[] | undefined;
};

type Output = string;

type FetchPapersOutput = {
	question: string;
	chatHistory: LangChainChatHistoryMessage[];
	papers: string;
};

export const answerEngineChain = RunnableSequence.from<Input, Output>([
	RunnableMap.from<Input, FetchPapersOutput>({
		question: (input) => input.question,
		chatHistory: (input) => input.chatHistory,
		papers: (input) => {
			if (input.papers) {
				return JSON.stringify(input.papers);
			}
			return fetchPapersChain as unknown as string;
		},
	}).withConfig({
		runName: "FetchPapers",
	}),
	getGenerateAnswerChain(),
]).withConfig({
	runName: "AnswerEngine",
});
