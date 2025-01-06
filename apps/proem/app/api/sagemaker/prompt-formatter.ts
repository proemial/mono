export module PromptFormatter {
	export const llama32 = (userMessage: string) =>
		`<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\n${userMessage}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`;

	export const nomic15EmbedDocument = (document: string) =>
		`search_document: ${document}`;

	export const nomic15EmbedQuestion = (question: string) =>
		`search_query: ${question}`;
}
