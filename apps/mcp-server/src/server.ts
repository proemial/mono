import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runStdioServer } from "./transport/stdio";
import { fetchPapers } from "./helpers/fetch-papers";

const server = new McpServer({
	name: "proem-mcp-server",
	version: "1.0.0",
});

server.tool(
	"fetch-papers",
	"Fetch scientific research papers matching the query",
	{ query: z.string() },
	async ({ query }) => {
		try {
			const papers = await fetchPapers(query);

			return {
				content: papers.map((paper) => ({
					type: "text",
					text: `**[${paper.title}](${paper.primary_location.landing_page_url})**\n\n${paper.abstract}`,
				})),
				_meta: {
					query,
				},
			};
		} catch (error) {
			return {
				isError: true,
				content: [{ type: "text", text: "Error fetching papers" }],
				_meta: {
					query,
				},
			};
		}
	},
);

// Connect the MCP server to a transport - either STDIO or HTTP
// runHTTPServer(server);
runStdioServer(server);
