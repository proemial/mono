import { Language, LlamaParseReader } from "llamaindex";

export const parseFile = async (
	document: Uint8Array,
	filename?: string,
	language: Language = "en",
) => {
	const reader = new LlamaParseReader({
		resultType: "markdown",
		language,
	});
	const documents = await reader.loadDataAsContent(document, filename);
	return documents;
};
