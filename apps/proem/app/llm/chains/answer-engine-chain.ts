import { getFeatureFlag } from "@/app/components/feature-flags/server-flags";
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
import { identifyIntentChain } from "./identify-intent-chain";
import { getGenerateAnswerChainGpt4 } from "./generate-answer-chain-gpt-4";
import { vectorisePapers } from "./paper-vectoriser";
import { Paper } from "@/app/api/paper-search/search";

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

const isGpt4Enabled = async () => {
	return (await getFeatureFlag("askGpt4")) ?? false;
};

const useGpt4IfPapersAvailable = RunnableBranch.from<
	{
		question: string;
		chatHistory: LangChainChatHistoryMessage[];
		papers: PapersAsString;
	},
	Output
>([[isGpt4Enabled, getGenerateAnswerChainGpt4()], getGenerateAnswerChain()]);

const answerIfPapersAvailable = RunnableBranch.from<
	{
		question: string;
		chatHistory: LangChainChatHistoryMessage[];
		papers: PapersAsString;
	},
	Output
>([
	[hasPapersAvailable, useGpt4IfPapersAvailable],
	() => `I'm sorry, I could't find any relevant research papers to support an
	answer. Please try again with a different question.`,
]);

type ReRankInput = { question: string; papers: string };
const reRankAndLimit = RunnableLambda.from<ReRankInput, ReRankInput>(
	async (input) => {
		const reRankingEnabled = await getFeatureFlag("vectorRerankAndFilter");

		if (!reRankingEnabled) {
			return {
				...input,
				papers: JSON.stringify(JSON.parse(input.papers).slice(0, 30)),
			};
		}

		const reRanked = await vectorisePapers(
			input.question,
			JSON.parse(input.papers) as Paper[],
		);

		return { ...input, papers: JSON.stringify(reRanked) };
	},
).withConfig({ runName: "ReRankPapers" });

const answerChain = RunnableSequence.from<Input, Output>([
	RunnablePassthrough.assign({
		papers: fetchPapersChain,
	}),
	reRankAndLimit,
	answerIfPapersAvailable,
]).withConfig({ runName: "Answer" });

const declineChain = RunnableLambda.from<Input & { intent: string }, Output>(
	(input) => input.intent,
).withConfig({ runName: "Decline" });

// The intent is supported if it is a single word and contains "SUPPORTED"
const isSupportedIntentAndFeatureEnabledAndInitialQuestion = async (
	input: Input & {
		intent: string;
	},
) => {
	const isSupportedIntent =
		input.intent.split(" ").length === 1 && input.intent.includes("SUPPORTED");
	const isInitialQuestion = input.chatHistory.length === 0;
	const isGuardrailEnabled =
		(await getFeatureFlag("useGuardrailsOnInitialQuestion")) ?? false;

	console.log(`INTENT: ${input.intent}`);
	console.log(`Supported: ${isSupportedIntent}`);
	console.log(`Initial question: ${isInitialQuestion}`);
	console.log(`isGuardrailEnabled: ${isGuardrailEnabled}`);

	if (isGuardrailEnabled && isInitialQuestion && !isSupportedIntent) {
		return false;
	}
	return true;
};

const answerIfSupportedIntent = RunnableBranch.from<
	Input & { intent: string },
	Output
>([
	[isSupportedIntentAndFeatureEnabledAndInitialQuestion, answerChain],
	declineChain,
]).withConfig({
	runName: "AnswerIfSupportedIntent",
});

export const answerEngineChain = answerChain.withConfig({
	runName: "AnswerEngine",
});

export const answerEngineChainExperimental = RunnableSequence.from<
	Input,
	Output
>([
	RunnablePassthrough.assign({
		intent: identifyIntentChain,
	}),
	answerIfSupportedIntent,
]).withConfig({
	runName: "AnswerEngine",
});
