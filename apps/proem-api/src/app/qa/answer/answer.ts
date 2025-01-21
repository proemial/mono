import LlmModels from "@proemial/adapters/llm/models";
import qdrantHelper from "@proemial/adapters/qdrant/adapter";
import { CoreMessage, generateText } from "ai";

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

	const top3References = references
		.map((r) => ({
			source: r.payload?.text as string,
			score: r.score,
			filename: r.payload?.file as string,
			position: r.payload?.position as number[],
		}))
		.sort((a, b) => b.score - a.score)
		.slice(0, 3);

	const answer = await llmAnswer(
		question,
		top3References.map((r) => r.source),
		options,
	);

	return { answer, references: top3References };
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
			system: options ? systemPromptWithOptions : systemPromptFreeText,
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

const systemPromptWithOptions = `
You are a helpful assistant that answers questions based on the provided sources. More specifically, you are given a list of options to choose from when answering the question, limiting your answer to one of the options provided.

Your answer must be one of the options provided, matching the option exactly to the letter.

Read through the provided sources to discover which option is the correct answer.
`;

const systemPromptFreeText = `
You are a helpful assistant that answers questions based on the provided sources. Keep your answers short and concise, not exceeding a single sentence.
`;

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
