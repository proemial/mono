import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { runStdioServer } from "./transport/stdio";

const server = new McpServer({
	name: "proem-mcp-server",
	version: "1.0.0",
});

runStdioServer(server);
