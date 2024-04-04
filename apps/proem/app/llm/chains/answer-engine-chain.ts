import { Paper } from "@/app/api/paper-search/search";
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
import { buildOpenAIChatModel } from "../models/openai-model";
import { LangChainChatHistoryMessage } from "../utils";
import { generateAnswerChain } from "./generate-answer-chain";
import { inputGuardrailChain } from "./input-guardrail-chain";
import { vectorisePapers } from "./paper-vectoriser";

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
>([
	[
		isGpt4Enabled,
		generateAnswerChain(buildOpenAIChatModel("gpt-4-0125-preview", "ask")),
	],
	generateAnswerChain(),
]);

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

const declineChain = RunnableLambda.from<
	{ inputGuardrailReponse: string },
	Output
>((input) => input.inputGuardrailReponse).withConfig({ runName: "Decline" });

const isSupportedQuestion = async (
	input: Input & {
		inputGuardrailReponse: string;
	},
) => {
	const isGuardrailFeatureEnabled =
		(await getFeatureFlag("useGuardrailsOnInitialQuestion")) ?? false;
	const isInitialQuestion = input.chatHistory.length === 0;
	const isSupportedQuestion =
		input.inputGuardrailReponse.split(" ").length === 1 &&
		input.inputGuardrailReponse.includes("SUPPORTED");

	if (isGuardrailFeatureEnabled && isInitialQuestion && !isSupportedQuestion) {
		return false;
	}
	return true;
};

const answerIfSupportedQuestion = RunnableBranch.from<
	Input & { inputGuardrailReponse: string },
	Output
>([[isSupportedQuestion, answerChain], declineChain]).withConfig({
	runName: "AnswerIfSupportedQuestion",
});

export const answerEngineChain = RunnableSequence.from<Input, Output>([
	RunnablePassthrough.assign({
		inputGuardrailReponse: inputGuardrailChain,
	}),
	answerIfSupportedQuestion,
]).withConfig({
	runName: "AnswerEngine",
});
