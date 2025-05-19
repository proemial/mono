import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { fetchPapers } from "./helpers/fetch-papers";

export const getMcpServer = () => {
	const server = new McpServer({
		name: "proem-mcp-server",
		version: "1.0.0",
	});

	server.tool(
		"search-papers",
		"Search for scientific research papers matching a given search query using the Proem Index",
		{
			query: z
				.string()
				.describe(
					"The query to search for. The search uses vector similarity, so the query should contain as many keywords as possible.",
				),
		},
		async ({ query }): Promise<CallToolResult> => {
			try {
				console.log("Searching for papers…");
				console.log(`Query: ${query}`);
				const papers = await fetchPapers(query);
				console.log(`Found ${papers.length} papers`);
				const formattedPapers: string[] = papers.map(
					(paper) =>
						`**[${paper.title}] (${paper.primary_location.landing_page_url})**\n\n${paper.abstract}`,
				);
				console.log(formattedPapers);
				return {
					content: formattedPapers.map((paper) => ({
						type: "text",
						text: paper,
					})),
					_meta: {
						query,
					},
				};
			} catch (_) {
				return {
					isError: true,
					content: [{ type: "text", text: "Error searching for papers" }],
					_meta: {
						query,
					},
				};
			}
		},
	);

	return server;
};
