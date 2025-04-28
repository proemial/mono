import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export const runStdioServer = async (mcpServer: Server) => {
	const transport = new StdioServerTransport();
	await mcpServer.connect(transport);
};
