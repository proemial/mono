import { MarkdownNodeParser } from "@llamaindex/core/node-parser";
import { Document } from "@llamaindex/core/schema";

export function chunkMarkdown(text: string) {
	const splitter = new MarkdownNodeParser();
	splitter.includeMetadata = true;

	return splitter.getNodesFromDocuments([new Document({ text })]);
}
