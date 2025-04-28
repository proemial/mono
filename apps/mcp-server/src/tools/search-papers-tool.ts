import { CallToolResult, Tool } from "@modelcontextprotocol/sdk/types.js";
import { ReferencedPaper } from "@proemial/adapters/redis/news";

type Feature = {
	id: string;
	label: string;
	score: number;
	type: "topic" | "keyword" | "concept";
};

type QdrantPaper = ReferencedPaper & {
	score: number;
	features: Feature[];
};

export const SEARCH_PAPERS_TOOL: Tool = {
	name: "search_papers",
	description:
		"Search for scientific research papers matching a given search query using the Proem Index",
	inputSchema: {
		type: "object",
		properties: {
			query: {
				type: "string",
				description:
					"The query to search for. The search uses vector similarity, so the query should contain as many keywords as possible.",
			},
		},
		required: ["query"],
	},
};

export const handleSearchPapers = async (
	query: string,
): Promise<CallToolResult> => {
	try {
		const papers = await fetchPapers(query);
		const formattedPapers: string[] = papers.map(
			(paper) =>
				`**[${paper.title}] (${paper.primary_location.landing_page_url})**\n\n${paper.abstract}`,
		);
		return {
			content: formattedPapers.map((paper) => ({
				type: "text",
				text: paper,
			})),
			_meta: {
				query,
			},
		};
	} catch (_) {
		return {
			isError: true,
			content: [{ type: "text", text: "Error searching for papers" }],
			_meta: {
				query,
			},
		};
	}
};

const fetchPapers = async (query: string) => {
	const result = await fetch("https://index.proem.ai/api/search", {
		method: "POST",
		body: JSON.stringify({
			query: query as string,
			from: "2024-01-01",
			extended: true,
		}),
	});
	const { papers } = (await result.json()) as { papers: QdrantPaper[] };
	return papers;
};
