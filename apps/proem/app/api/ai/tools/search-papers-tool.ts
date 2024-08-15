import { searchPapers } from "@/app/api/ai/search-papers";
import { searchToolConfig } from "@/app/prompts/ask_agent";
import { z } from "zod";

export const searchPapersTool = {
	description: searchToolConfig.description,
	parameters: z.object({
		searchQuery: z.string().describe("The search query for the paper."),
	}),
	execute: async ({ searchQuery }: { searchQuery: string }) =>
		searchPapers(searchQuery),
};
