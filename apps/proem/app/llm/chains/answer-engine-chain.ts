import { fetchPapersChain } from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
import {
	RunnableBranch,
	RunnableLambda,
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

const answerChain = RunnableSequence.from<Input & { intent: string }, Output>([
	RunnablePassthrough.assign({
		papers: (input) => {
			if (input.papers) {
				return JSON.stringify(input.papers);
			}
			return fetchPapersChain;
		},
	}),
	getGenerateAnswerChain(),
]);

const abortChain = RunnableLambda.from<Input, Output>(
	() => "We're sorry, but we can't answer that question.",
);

const isSupportedIntent = (input: Input & { intent: string }) =>
	input.intent !== "0";

const answerIfSupportedIntent = RunnableBranch.from<
	Input & { intent: string },
	Output
>([[isSupportedIntent, answerChain], abortChain]);

export const answerEngineChain = RunnableSequence.from<Input, Output>([
	RunnablePassthrough.assign({
		intent: getIdentifyIntentChain(),
	}),
	answerIfSupportedIntent,
]).withConfig({
	runName: "AnswerEngine",
});
