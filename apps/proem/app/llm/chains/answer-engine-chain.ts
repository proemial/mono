import { Paper } from "@/app/api/paper-search/search";
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
import { generateAnswerChain } from "./generate-answer-chain";
import { vectorisePapers } from "./paper-vectoriser";
import { rephraseQuestionChain } from "./rephrase-question-chain";

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
	[hasPapersAvailable, generateAnswerChain()],
	() => `I'm sorry, I could't find any relevant research papers to support an
	answer. Please try again with a different question, or start a new
	conversation.`,
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

const answerChain = RunnableLambda.from(async () => {
	return RunnableSequence.from<Input, Output>([
		RunnablePassthrough.assign({
			// Note: This overwrites the original question
			question: rephraseQuestionChain(),
		}),
		RunnablePassthrough.assign({
			papers: fetchPapersChain,
		}),
		reRankAndLimit,
		answerIfPapersAvailable,
	]);
});

export const answerEngineChain = answerChain.withConfig({
	runName: "AnswerEngine",
});
