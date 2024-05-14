export const model = "gpt-4o";

type SupportedModels = "gpt-4o" | "gpt-3.5-turbo-0125";

export function context(title: string, abstract: string) {
	return {
		role: "system",
		content: `Here is some context: title: ${title}, abstract: ${abstract}. For future reference, "core concepts" are considered short technical concepts and lingo relevant to the title and abstract.`,
	};
}

export function question(model: SupportedModels) {
	return model === "gpt-3.5-turbo-0125"
		? "In a single sentence, "
		: 'In a single sentence enclosing "core concepts" with double parenthesis,';
}
