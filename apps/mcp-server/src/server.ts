import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runHTTPServer } from "./transport/http-with-sse";
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
			const formattedPapers: string = papers
				.map((paper) => {
					return `Title: ${paper.title}\nURL: ${paper.primary_location.landing_page_url}\n${paper.abstract}`;
				})
				.join("\n\n");
			return {
				content: [{ type: "text", text: formattedPapers }],
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
