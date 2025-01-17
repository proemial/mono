import {
	CoreAssistantMessage,
	CoreMessage,
	CoreToolMessage,
	generateText,
} from "ai";
import LlmModels from "@proemial/adapters/llm/models";
import qdrantHelper from "@proemial/adapters/qdrant/adapter";

const EmbeddingsModel = "nomic-embed-text-v1.5";

const qdrant = qdrantHelper({
	url: process.env.QDRANT_QA_URL as string,
	apiKey: process.env.QDRANT_QA_API_KEY as string,
});

export async function answerQuestion(
	collection: string,
	question: string,
	options?: string[],
) {
	const embeddedQuestion = await LlmModels.api.embeddings()(
		question,
		EmbeddingsModel,
	);

	const references = await qdrant.points.search(collection, {
		vector: embeddedQuestion,
	});

	const answer = await llmAnswer(
		question,
		references.map((p) => p.payload?.text as string),
		options,
	);

	return { answer, references };
}

async function llmAnswer(
	question: string,
	sources: string[],
	options?: string[],
) {
	try {
		const messages = [];

		if (!options) {
			messages.push({
				role: "user",
				content: prompts.freeText(question, sources),
			} as CoreMessage);
		} else {
			messages.push({
				role: "user",
				content: prompts.withOptions(question, sources, options),
			} as CoreMessage);
		}

		const { text } = await generateText({
			model: LlmModels.api.answer(),
			messages,
		});

		return text;
	} catch (e) {
		console.error("[qa][answer] llmAnswer failed", e);
		throw new Error("llmAnswer failed", {
			cause: e,
		});
	}
}

const prompts = {
	freeText: (question: string, sources: string[]) => {
		return `
Given the following sources: ${sources}
Provide a short and concise answer to the following question: ${question}
			`;
	},

	withOptions: (question: string, sources: string[], options: string[]) => {
		return `
Given the following sources: ${sources}
Provide a answer from the list of options to the following question: ${question}

Options: ${options}

Your answer must be one of the options provided.
			`;
	},
};
