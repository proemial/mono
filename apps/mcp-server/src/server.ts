import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
	SEARCH_PAPERS_TOOL,
	handleSearchPapers,
} from "./tools/search-papers-tool";
import { runHTTPServer } from "./transport/http-with-sse";
import { runStdioServer } from "./transport/stdio";

const server = new Server(
	{
		name: "proem-mcp-server",
		version: "1.0.0",
	},
	{
		capabilities: {
			tools: {},
		},
	},
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools: [SEARCH_PAPERS_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	try {
		switch (request.params.name) {
			case "search_papers": {
				const { query } = request.params.arguments as { query: string };
				return await handleSearchPapers(query);
			}
			default:
				return {
					isError: true,
					content: [
						{
							type: "text",
							text: `Unknown tool: ${request.params.name}`,
						},
					],
				};
		}
	} catch (error) {
		return {
			isError: true,
			content: [
				{
					type: "text",
					text: `Error: ${error instanceof Error ? error.message : String(error)}`,
				},
			],
		};
	}
});

// Connect the MCP server to a transport - either STDIO or HTTP
// runHTTPServer(server);
runStdioServer(server);
