import { Time } from "@proemial/utils/time";
import { Message, streamText } from "ai";
import { groqProvider } from "../ai/models/groq";
import { QdrantPaper } from "../news/annotate/fetch/steps/fetch";
import { checkCitations } from "./tools/check-citations";
import { ollamaProvider } from "../ai/models/ollama";
import { galadrielProvider } from "../ai/models/galadriel";
import { sambanovaProvider } from "../ai/models/sambanova";

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = (await req.json()) as { messages: Message[] };
	const latestUserMessage = messages
		.toReversed()
		.find((m) => m.role === "user");
	if (!latestUserMessage) {
		throw new Error("No user message found");
	}

	const paperAbstracts = await qdrantQuery(latestUserMessage.content);
	console.log("papers", paperAbstracts);

	try {
		const result = streamText({
			model: groqProvider("llama-3.1-8b-instant"),
			// model: ollamaProvider("llama3.1:8b"),
			// model: ollamaProvider("llama3.2:3b"),
			// model: galadrielProvider("llama3.1:70b"),
			system: systemPrompt(latestUserMessage.content, paperAbstracts),
			tools: {
				checkCitations: checkCitations(paperAbstracts),
			},
			messages,
			maxSteps: 5,
			maxRetries: 0,
			toolChoice: "auto",
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error(error);
	}
}

const systemPrompt = (question: string, paperAbstracts: string[]) => `
You are a helpful assistant.

You are given a question to answer and a list of research papers.

If the question can be answered using the papers, then answer the question based on the papers. Otherwise, say that you do not know the answer based on the research you found. When answering the question based on the papers, make sure to cite the papers using their numerical indices (e.g. "[1]" references the first paper in the list).

To ensure that you are citing the papers correctly, you have access to the "checkCitations" tool, which will check whether or not a given statement contains correct references to the papers. If the check passes, then respond using the exact statement as your final answer. If it fails, then reformulate your statement and reiterate over the citations until the check passes.

Your answer must not exceed 50 words.

Question: ${question}

Papers:
${paperAbstracts.map((abstract, index) => `- Paper ${index + 1}: ${abstract}`).join("\n")}
`;

// Note: Consider converting this to a tool, if we do not always want to lookup
// papers.
const qdrantQuery = async (input: string) => {
	const begin = Time.now();

	try {
		const papersResult = await fetch("https://index.proem.ai/api/search", {
			method: "POST",
			body: JSON.stringify({
				query: input,
				from: "2024-01-01",
				extended: true,
			}),
		});
		const { papers } = (await papersResult.json()) as { papers: QdrantPaper[] };
		return papers.slice(0, 2).map((paper) => paper.abstract); // TODO: Remove this limit (set to reduce token usage)
	} finally {
		Time.log(begin, `[qdrantQuery] ${input}`);
	}
};
