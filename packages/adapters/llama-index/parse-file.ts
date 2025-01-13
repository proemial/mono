import { Language, LlamaParseReader } from "llamaindex";

export const parseFile = async (
	fileContent: Uint8Array,
	filename?: string,
	language: Language = "en",
) => {
	const reader = new LlamaParseReader({
		resultType: "markdown",
		language,
	});
	const documents = await reader.loadDataAsContent(fileContent, filename);
	return documents;
};
