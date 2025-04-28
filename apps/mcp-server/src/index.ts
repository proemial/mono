import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { toFetchResponse, toReqRes } from "fetch-to-node";
import { Hono } from "hono";
import { getMcpServer } from "./mcp-server";

const app = new Hono<{ Bindings: Env }>();
app.get("/", async (c) => c.text("Hello Node.js!"));

app.post("/mcp", async (c) => {
	const { req, res } = toReqRes(c.req.raw);
	const body = await c.req.json();
	const server = getMcpServer();
	try {
		const transport: StreamableHTTPServerTransport =
			new StreamableHTTPServerTransport({
				sessionIdGenerator: undefined,
			});
		await server.connect(transport);
		await transport.handleRequest(req, res, body);
		res.on("close", () => {
			console.log("Request closed");
			transport.close();
			server.close();
		});
		return toFetchResponse(res);
	} catch (error) {
		console.error("Error handling MCP request:", error);
		if (!res.headersSent) {
			res.writeHead(500).end(
				JSON.stringify({
					jsonrpc: "2.0",
					error: {
						code: -32603,
						message: "Internal server error",
					},
					id: null,
				}),
			);
			return toFetchResponse(res);
		}
	}
});

app.get("/mcp", async (c) => {
	const { res } = toReqRes(c.req.raw);
	res.writeHead(405).end(
		JSON.stringify({
			jsonrpc: "2.0",
			error: {
				code: -32000,
				message: "Method not allowed.",
			},
			id: null,
		}),
	);
	return toFetchResponse(res);
});

app.delete("/mcp", async (c) => {
	const { res } = toReqRes(c.req.raw);
	res.writeHead(405).end(
		JSON.stringify({
			jsonrpc: "2.0",
			error: {
				code: -32000,
				message: "Method not allowed.",
			},
			id: null,
		}),
	);
	return toFetchResponse(res);
});

export default app;
