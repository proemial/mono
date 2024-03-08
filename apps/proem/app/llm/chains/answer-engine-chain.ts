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

const hasPapersAvailable = (input: { papers: string }) => {
	const papers = JSON.parse(input.papers);
	return papers.length > 0;
};

const answerIfPapersAvailable = RunnableBranch.from<
	{
		question: string;
		chatHistory: LangChainChatHistoryMessage[];
		papers: string;
	},
	Output
>([
	[hasPapersAvailable, getGenerateAnswerChain()],
	() => `I'm sorry, I could't find any relevant research papers to support an
	answer. Please try again with a different question.`,
]);

const answerChain = RunnableSequence.from<Input & { intent: Intent }, Output>([
	RunnablePassthrough.assign({
		papers: fetchIfNoCachedPapers,
	}),
	answerIfPapersAvailable,
]).withConfig({ runName: "Answer" });

const declineChain = RunnableLambda.from<Input & { intent: Intent }, Output>(
	// Static response for when user intent is `UNKNOWN`
	(input) =>
		"I didn't quite understand that question. Please try again with a different question.",
).withConfig({ runName: "Decline" });

const isUnknownIntent = (input: { intent: Intent }) => {
	return input.intent === "UNKNOWN";
};

const declineIfUnknownIntent = RunnableBranch.from<
	Input & { intent: Intent },
	Output
>([[isUnknownIntent, declineChain], answerChain]).withConfig({
	runName: "DeclineIfUnknownIntent",
});

export const answerEngineChain = RunnableSequence.from<Input, Output>([
	RunnablePassthrough.assign({
		intent: getIdentifyIntentChain(),
	}),
	answerChain,
]).withConfig({
	runName: "AnswerEngine",
});

export const answerEngineExperimental = RunnableSequence.from<Input, Output>([
	RunnablePassthrough.assign({
		intent: getIdentifyIntentChain(),
	}),
	declineIfUnknownIntent,
]).withConfig({
	runName: "AnswerEngine",
});
