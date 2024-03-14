import {
	PapersAsString,
	fetchPapersChain,
} from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
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

const hasPapersAvailable = (input: { papers: PapersAsString }) => {
	const papers = JSON.parse(input.papers);
	return papers.length > 0;
};

const answerIfPapersAvailable = RunnableBranch.from<
	{
		question: string;
		chatHistory: LangChainChatHistoryMessage[];
		papers: PapersAsString;
	},
	Output
>([
	[hasPapersAvailable, getGenerateAnswerChain()],
	() => `I'm sorry, I could't find any relevant research papers to support an
	answer. Please try again with a different question.`,
]);

const answerChain = RunnableSequence.from<Input, Output>([
	RunnablePassthrough.assign({
		papers: fetchPapersChain,
	}),
	answerIfPapersAvailable,
]).withConfig({ runName: "Answer" });

const declineChain = RunnableLambda.from<Input & { intent: Intent }, Output>(
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
).withConfig({ runName: "Decline" });

const isUnsupportedIntent = (input: { intent: Intent }) => {
	const unsupportedIntents: Intent[] = [
		"FIND_PAPER",
		"FIND_LATEST_PAPERS",
		"FIND_INFLUENTIAL_PAPERS",
		"FIND_PAPERS_BY_AUTHOR",
		"FIND_PAPERS_CITING_A_GIVEN_PAPER",
	];
	return unsupportedIntents.includes(input.intent);
};

const declineIfUnsupportedIntent = RunnableBranch.from<
	Input & { intent: Intent },
	Output
>([[isUnsupportedIntent, declineChain], answerChain]).withConfig({
	runName: "DeclineIfUnsupportedIntent",
});

export const answerEngineChain = RunnableSequence.from<Input, Output>([
	RunnablePassthrough.assign({
		intent: getIdentifyIntentChain(),
	}),
	answerChain,
]).withConfig({
	runName: "AnswerEngine",
});

// We need to improve intent detection before we can branch on it
export const answerEngineChainWithIntentBranching = RunnableSequence.from<
	Input,
	Output
>([
	RunnablePassthrough.assign({
		intent: getIdentifyIntentChain(),
	}),
	declineIfUnsupportedIntent,
]).withConfig({
	runName: "AnswerEngine",
});
