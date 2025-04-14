import express, { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const HTTP_PORT = 3001;

export const runHTTPServer = async (mcpServer: McpServer) => {
	const app = express();

	// To support multiple simultaneous connections we have a lookup object from
	// sessionId to transport
	const transports: { [sessionId: string]: SSEServerTransport } = {};

	app.get("/sse", async (_: Request, res: Response) => {
		const transport = new SSEServerTransport("/messages", res);
		transports[transport.sessionId] = transport;
		res.on("close", () => {
			delete transports[transport.sessionId];
		});
		await mcpServer.connect(transport);
	});

	app.post("/messages", async (req: Request, res: Response) => {
		const sessionId = req.query.sessionId as string;
		const transport = transports[sessionId];
		if (transport) {
			await transport.handlePostMessage(req, res);
		} else {
			res.status(400).send("No transport found for sessionId");
		}
	});

	console.log(`Listening on port ${HTTP_PORT}…`);
	app.listen(HTTP_PORT);
};
