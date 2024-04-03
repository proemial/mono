import { fetchPapersChain } from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
import { vectorisePapers } from "@/app/llm/chains/paper-vectoriser";
import {
	RunnableLambda,
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { DynamicTool } from "langchain/tools";
import { Paper } from "../paper-search/search";

export function getTools() {
	const searchPapers = new DynamicTool({
		name: "SearchPapers",
		description: "Find specific research papers matching a user query",
		func: searchTool,
	});

	return [searchPapers];
}

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

const answerChain = RunnableSequence.from<Input, ReRankInput>([
	RunnablePassthrough.assign({
		papers: fetchPapersChain,
	}),
	reRankAndLimit,
]).withConfig({ runName: "FetchPapers" });

async function searchTool(input: string) {
	console.log("Triggered SearchPapers,", `input: '${input}'`);

	return (
		await answerChain.invoke({
			question: input,
		})
	).papers;
}
