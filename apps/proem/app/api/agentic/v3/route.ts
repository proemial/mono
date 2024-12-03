import { generateObject, generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { ollamaProvider } from "../../ai/models/ollama";
import { QdrantPaper } from "../../news/annotate/fetch/steps/fetch";
import { z } from "zod";

const MAX_ITERATIONS = 10;

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	try {
		const result = await loop(
			"Are some types of tobacco healthier than others?",
		);
		return NextResponse.json({ result });
	} catch (error) {
		return NextResponse.json({ error: "An error occurred" }, { status: 500 });
	}
}

type State = {
	action: "generate" | "review" | "done";
	iterations: number;
	answer?: string;
	feedback?: string;
};

const loop = async (question: string) => {
	console.log(`[question] ${question}`);

	// Fetching relevant papers
	const paperAbstracts = await qdrantQuery(question, 2);

	let state: State = {
		action: "generate",
		iterations: 0,
	};
	while (state.action !== "done" && state.iterations < MAX_ITERATIONS) {
		try {
			switch (state.action) {
				// Generating an answer to the question
				case "generate": {
					const { answer, feedback } = state;
					const { text } = await generateText({
						model: ollamaProvider("llama3.2:3b"),
						system: generateSystemPrompt(answer, feedback),
						prompt: `Question: ${question}\n\nPapers:\n${paperAbstracts.map((abstract, index) => `- Paper ${index + 1}: ${abstract}`).join("\n")}`,
						maxRetries: 0,
					});
					console.log(`[${state.iterations}:generate:answer]\n${text}`);
					state = {
						action: "review",
						iterations: state.iterations + 1,
						answer: text,
						feedback: undefined,
					};
					break;
				}

				// Reviewing the answer
				case "review": {
					const { answer } = state;
					if (!answer) {
						throw new Error("No answer to review");
					}
					const { object } = await generateObject({
						model: ollamaProvider("llama3.2:3b"),
						schema: z.object({
							result: z
								.enum(["pass", "fail"])
								.describe(
									"Whether or not the answer contains correct citations to the papers.",
								),
							feedback: z
								.string()
								.describe(
									"Your feedback on the answer, used for providing a better one. Highlight any problems you found.",
								),
						}),
						system: reviewSystemPrompt,
						prompt: `Statement: ${answer}\nPapers:\n${paperAbstracts.map((abstract, index) => `- Paper ${index + 1}: ${abstract}`).join("\n")}`,
						maxRetries: 0,
					});
					console.log(
						`[${state.iterations}:review:result:${object.result}]\n${object.feedback}`,
					);
					state = {
						...state,
						action: object.result === "pass" ? "done" : "generate",
						iterations: state.iterations + 1,
						feedback: object.feedback,
					};
					break;
				}

				default: {
					throw new Error(`Unknown state: ${state.action}`);
				}
			}
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	return state;
};

const qdrantQuery = async (input: string, limit = 10) => {
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
		const limitedPaperAbstracts = papers
			.slice(0, limit)
			.map((paper) => paper.abstract);
		console.log(`[qdrant] found ${limitedPaperAbstracts.length} papers`);
		return limitedPaperAbstracts;
	} catch (error) {
		console.log("[qdrant] failed to find papers ");
		throw error;
	}
};

const generateSystemPrompt = (
	previousAnswer: string | undefined,
	feedback: string | undefined,
) => {
	const feedbackParagraph =
		previousAnswer && feedback
			? `
You have previously answered this question and have received feedback. This is a feedback loop. Here is your previous answer and feedback:

Previous answer: ${previousAnswer}
Feedback: ${feedback}

Now, reflect upon the feedback and incorporate it into a better answer.
	`
			: "";

	return `
You are given a question to answer and a list of research papers.

If the question can be answered using information from the papers, then answer the question based on the papers. Otherwise, say that you do not know the answer based on the research you found. When answering the question based on the papers, make sure to cite the papers ONLY using their numerical indices (e.g. "[1]" references the first paper in the list). Do not refer to the papers in any other way than e.g. "Birds can fly [2]".

Your answer must not exceed 50 words.

Example 1:
Question: "What is the capital of France?"
Papers:
- Paper 1: "France is a country in Europe."
- Paper 2: "Paris is the capital of France."
Answer: "Paris is the capital of France [2]."

${feedbackParagraph}
`;
};

const reviewSystemPrompt = `
Given a statement and a list of research papers, determine whether or not the statement contains correct citations to the papers.

The citations must correctly formatted, be numerical and the numbers must match the index of the paper in the list. The format is \`[number]\` - no other reference to the papers is allowed.

Step 1: Read all of the papers.
Step 2: Read the statement.
Step 3: For each citation in the statement, verify that it points to a piece of information in the paper that is referenced, and that the citation is numerical and matches the index of the paper in the list (e.g. "[1]" references the first paper in the list).
Step 4: Return whether or not all citations in the statement are correct.

Example 1:
Statement: "Birds can fly [2]."
Papers:
- Paper 1: "We found that dark matter is a form of energy."
- Paper 2: "We found that birds can indeed fly."
- Paper 3: "We found that global warming is real."
Response: { result: "pass", feedback: "The citation "[2]" correctly points to the second paper, where it states that birds can fly, confirming that the information in the statement is correct." }

Example 2:
Statement: "God exists [1]."
Papers:
- Paper 1: "We found that dark matter is a form of energy."
- Paper 2: "We found that birds can indeed fly."
- Paper 3: "We found that global warming is real."
Response: { result: "fail", feedback: "The citation "[1]" points to the first paper, where it states that dark matter is a form of energy, which is not related to the existence of God." }
`;
