import { openAlexChain } from "@/app/api/bot/ask2/fetch-papers";
import { searchToolConfig } from "@/app/prompts/ask_agent";
import { z } from "zod";

export const searchPapersTool = {
	description: searchToolConfig.description,
	parameters: z.object({
		searchQuery: z.string().describe("The search query for the paper."),
	}),
	execute: async ({ searchQuery }: { searchQuery: string }) => {
		const result = await openAlexChain.invoke({
			question: searchQuery,
		});
		const output = JSON.parse(result.papers);
		return output;
	},
};
