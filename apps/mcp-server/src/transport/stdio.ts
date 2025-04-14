import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export const runStdioServer = async (mcpServer: McpServer) => {
	const transport = new StdioServerTransport();
	await mcpServer.connect(transport);
};
