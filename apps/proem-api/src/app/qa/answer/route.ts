import { generateText } from "ai";
import LlmModels from "@proemial/adapters/llm/models";
import qdrantHelper from "@proemial/adapters/qdrant/adapter";
import { NextResponse } from "next/server";

export const revalidate = 0;

const EmbeddingsModel = "nomic-embed-text-v1.5";

const qdrant = qdrantHelper({
	url: process.env.QDRANT_QA_URL as string,
	apiKey: process.env.QDRANT_QA_API_KEY as string,
});

export const POST = async (request: Request) => {
	const { question, collection } = await request.json();

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
	);

	return NextResponse.json({ answer, references });
};

async function llmAnswer(question: string, sources: string[]) {
	try {
		const { text } = await generateText({
			model: LlmModels.api.answer(),
			messages: [
				{
					role: "user",
					content: `
Given the following sources:

${sources}

Provide a short and concise answer to the following question: ${question}
			`,
				},
			],
		});

		return text;
	} catch (e) {
		console.error("[qa][answer] llmAnswer failed", e);
		throw new Error("llmAnswer failed", {
			cause: e,
		});
	}
}
