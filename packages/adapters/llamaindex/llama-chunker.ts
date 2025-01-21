import {
	MarkdownNodeParser,
	SentenceSplitter,
} from "@llamaindex/core/node-parser";
import { Document } from "@llamaindex/core/schema";

export function chunkMarkdown(text: string) {
	const splitter = new MarkdownNodeParser();
	splitter.includeMetadata = true;

	return splitter.getNodesFromDocuments([new Document({ text })]);
}

export function chunkSentences(
	fullText: string,
	options?: {
		chunkSize?: number;
		chunkOverlap?: number;
	},
) {
	const windowSplitter = new SentenceSplitter({
		chunkSize: options?.chunkSize ?? 400,
		chunkOverlap: options?.chunkOverlap ?? 50,
	});

	return windowSplitter.splitText(fullText);
}
