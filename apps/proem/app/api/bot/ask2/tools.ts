import { DynamicTool } from "langchain/tools";
import { openAlexChain } from "./fetch-papers";
import { searchToolConfig } from "@/app/prompts/ask_agent";

export function getTools() {
	const searchPapers = new DynamicTool({
		...searchToolConfig,
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
