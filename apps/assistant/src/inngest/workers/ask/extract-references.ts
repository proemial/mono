import { QdrantPaper } from "./1-summarize.task";

export function extractPapers(result: LlmSteps) {
	const tools = result.steps
		.at(-1)
		?.response.messages.filter((m) => m.role === "tool");
	console.log("tool-steps", tools?.length);

	const results = tools?.flatMap((m) =>
		m.content.filter(
			(c) =>
				c.type === "tool-result" &&
				// @ts-ignore
				"papers" in c.result,
		),
	);
	console.log("tool-results", results?.length);

	const papers = results?.flatMap((c) => {
		// @ts-ignore
		const papers = c.result.papers as QdrantPaper[];
		return papers.map((p) => ({
			url: `https://proem.ai/paper/oa/${p.id.split("/").at(-1)}`,
			title: p.title,
			abstract: p.abstract,
		}));
	});
	console.log("papers", papers?.length);

	return papers;
}

export type LlmSteps = { steps: LlmStep[] };

export type LlmStep = {
	stepType: string;
	text?: string;
	toolCalls?: {
		type: string;
		toolCallId: string;
		toolName: string;
		args: {
			query: string;
		};
	}[];
	toolResults?: {
		toolCallId: string;
		toolName: string;
		args: {
			query: string;
		};
		result: {
			papers: unknown;
		};
	}[];
	finishReason?: string;
	usage: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};
	warnings?: string[];
	request: {
		body: string;
	};
	response: {
		id: string;
		timestamp: Date;
		modelId: string;
		messages: {
			role: string;
			content: {
				type: string;
				text?: string;
				toolCallId?: string;
				toolName?: string;
				args?: { query: string };
				result?: unknown;
			}[];
		}[];
	};
};
