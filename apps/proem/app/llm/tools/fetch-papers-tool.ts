import { CallbackManagerForToolRun } from "@langchain/core/callbacks/manager";
import { StructuredTool, type ToolParams } from "@langchain/core/tools";
import { Env } from "@proemial/utils/env";
import { z } from "zod";
import { fetchPapers } from "@/app/api/paper-search/search";

/**
 * Options for the fetch papers tool.
 */
export type FetchPapersToolParams = ToolParams & {};

type FetchPaperResult = {
	title: string;
	link: string;
	abstract?: string;
};

/**
 * Tool for fetching papers from OpenAlex.
 */
export class FetchPapersTool extends StructuredTool {
	schema = z.object({
		keyConcept: z.string().describe(`A single common noun that is VERY likely to occur in the title of
    a research paper that contains the answer to the user's question. The
    argument MUST be a single word.`),
		relatedConcepts: z
			.string()
			.array()
			.describe(`The most closely related scientific concepts as well as two or
    three synonyms for the key concept. Preferrably two-grams or longer.`),
	});
	description =
		"A tool for fetching research papers from OpenAlex based on a given key concept and a set of related concepts.";
	name = "fetch_papers_json";
	protected apiKey: string | undefined;

	static lc_name(): string {
		return "FetchPapersTool";
	}

	constructor(fields?: FetchPapersToolParams) {
		super(fields);
		this.apiKey = Env.get("OPENALEX_API_KEY"); // TODO: Actually use the OpenAlex API key
		if (this.apiKey === undefined) {
			throw new Error(
				'No OpenAlex API key found. Set an environment variable named "OPENALEX_API_KEY".',
			);
		}
	}

	protected async _call(
		input: z.infer<typeof this.schema>,
		_runManager?: CallbackManagerForToolRun,
	): Promise<string> {
		const searchString = this._convertToOASearchString(
			input.keyConcept,
			input.relatedConcepts,
		);
		const papers = await fetchPapers(searchString);
		if (papers.length === 0) {
			throw new Error("No papers found for the given search parameters.");
		}
		const papersWithRelativeLinks = papers?.map(this._toRelativeLink) ?? [];
		return JSON.stringify(papersWithRelativeLinks); // TODO: Improve paper formatting
	}

	private _toRelativeLink(paper: FetchPaperResult) {
		return {
			title: paper.title,
			link: paper.link.replace("https://proem.ai", ""),
			abstract: paper.abstract ?? "",
		};
	}

	private _convertToOASearchString(title: string, abstract: string[]) {
		const query = `title.search:("${title}"),abstract.search:(${abstract
			.map((abstract) => `"${abstract}"`)
			.join(" OR ")})`;
		return encodeURIComponent(query);
	}
}
