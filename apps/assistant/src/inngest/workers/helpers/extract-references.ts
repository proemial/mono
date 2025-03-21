import { isId } from "@proemial/utils/uuid";
import { PaperWithSrcRef } from "../tools/search-papers-tool";

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
		const papers = c.result.papers as PaperWithSrcRef[];
		return papers.map((p) => ({
			url: `https://proem.ai/paper/oa/${p.id.split("/").at(-1)}`,
			title: p.title,
			abstract: p.abstract,
			srcRefId: p.srcRefId,
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

export const convertSourceRefsToNumberedLinks = (
	answer: string,
	papers: ReturnType<typeof extractPapers>,
) => {
	const srcRefMap = new Map<string, number>();
	let counter = 1;

	const converted = answer.replace(/\[[^\]]+\]/g, (match) => {
		const srcRefIds = match
			.slice(1, -1)
			.split(",")
			.map((id) => id.trim());

		// Handle single or multiple refs
		const links = srcRefIds.map((srcRefId) => {
			// Verify id validity
			if (!isId(srcRefId)) {
				return "";
			}
			// Verify paper existence
			const paper = papers?.find((p) => p.srcRefId === srcRefId);
			if (!paper) {
				return "";
			}
			if (!srcRefMap.has(srcRefId)) {
				srcRefMap.set(srcRefId, counter++);
			}
			return `[${srcRefMap.get(srcRefId)}](${paper.url})`;
		});

		// Return single link or multiple links wrapped in brackets
		return links.length === 1 ? `[${links[0]}]` : `[${links.join(", ")}]`;
	});

	// Remove empty link brackets filtered above (these may contain commas)
	return converted?.replace(/\s*\[(?:,\s*)*\]/g, "");
};
