import { DynamicTool } from "langchain/tools";
import { openAlexChain } from "./fetch-papers";

export function getTools() {
	const searchPapers = new DynamicTool({
		name: "SearchPapers",
		description: "Find specific research papers matching a user query",
		func: OpenAlexQuery,
	});

	return [searchPapers];
}

async function OpenAlexQuery(input: string) {
	console.log("Triggered SearchPapers,", `input: '${input}'`);

	const result = await openAlexChain.invoke({
		question: input,
	});

	return result.papers;
}
