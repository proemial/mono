import { fetchIfNoCachedPapers } from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
import {
	RunnableBranch,
	RunnableLambda,
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { LangChainChatHistoryMessage } from "../utils";
import { getGenerateAnswerChain } from "./generate-answer-chain";
import { getIdentifyIntentChain } from "./identify-intent-chain";
import { Intent } from "./intent";

type Input = {
	question: string;
	chatHistory: LangChainChatHistoryMessage[];
	papers: { link: string; abstract: string; title: string }[] | undefined;
};
type Output = string;

const answerChain = RunnableSequence.from<Input & { intent: Intent }, Output>([
	RunnablePassthrough.assign({
		papers: fetchIfNoCachedPapers,
	}),
	getGenerateAnswerChain(),
]);

const abortChain = RunnableLambda.from<Input & { intent: Intent }, Output>(
	(input) => {
		// Static responses for unsupported user intents
		const prefix = "It looks like you're looking for";
		const postfix = "I can't help with that yet, but come back again soon!";
		switch (input.intent) {
			case "FIND_PAPER":
				return `${prefix} a specific research paper. ${postfix}`;
			case "FIND_LATEST_PAPERS":
				return `${prefix} the latest research papers within a specific domain. ${postfix}`;
			case "FIND_INFLUENTIAL_PAPERS":
				return `${prefix} specific popular or influential research papers. ${postfix}`;
			case "FIND_PAPERS_BY_AUTHOR":
				return `${prefix} research papers by a specific author. ${postfix}`;
			case "FIND_PAPERS_CITING_A_GIVEN_PAPER":
				return `${prefix} research papers citing a specific paper. ${postfix}`;
			default:
				return "I didn't quite understand that. Please try again with a different question.";
		}
	},
);

const isSupportedIntent = (input: Input & { intent: Intent }) => {
	const supportedIntents: Intent[] = [
		"ANSWER_EVERYDAY_QUESTION",
		"ANSWER_FOLLOWUP_QUESTION",
		"EXPLAIN_CONCEPT",
	];
	return supportedIntents.includes(input.intent);
};

const answerIfSupportedIntent = RunnableBranch.from<
	Input & { intent: Intent },
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
