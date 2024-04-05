import { fetchPapersChain } from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
import { vectorisePapers } from "@/app/llm/chains/paper-vectoriser";
import {
	RunnableLambda,
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { Paper } from "../../paper-search/search";

type Input = {
	question: string;
};

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

export const openAlexChain = RunnableSequence.from<Input, ReRankInput>([
	RunnablePassthrough.assign({
		papers: fetchPapersChain,
	}),
	reRankAndLimit,
]).withConfig({ runName: "FetchPapers" });
