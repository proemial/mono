import { generateObject, tool } from "ai";
import { z } from "zod";
import { groqProvider } from "../../ai/models/groq";
import { ollamaProvider } from "../../ai/models/ollama";
import { galadrielProvider } from "../../ai/models/galadriel";

export const checkCitations = (paperAbstracts: string[]) =>
	tool({
		description:
			"A tool for evaluating whether or not a given statement contains correct citations to a given list of research papers.",
		parameters: z.object({
			statement: z.string().describe("The statement to check."),
		}),
		execute: async ({ statement }) => {
			console.log("[tool:checkCitations:begin]");
			console.log(statement);
			try {
				const { object } = await generateObject({
					// model: groqProvider("llama-3.1-8b-instant"),
					model: ollamaProvider("llama3.1:8b"),
					// model: galadrielProvider("llama3.1:8b"),
					prompt: toolPrompt(statement, paperAbstracts),
					schema: z.object({
						correct: z
							.boolean()
							.describe(
								"Whether or not all of the citations in the statement are correct.",
							),
					}),
					maxRetries: 0,
				});
				if (object.correct) {
					console.log("[tool:checkCitations:end:pass]");
				} else {
					console.log("[tool:checkCitations:end:fail]");
				}
				return object.correct;
			} catch (error) {
				console.log("[tool:checkCitations:error]");
				console.error(error);
			}
		},
	});

const toolPrompt = (statement: string, paperAbstracts: string[]) => `
Given a statement and a list of research papers, determine whether or not the statement contains correct citations to the papers.

The citations must be numerical and the numbers must match the index of the paper in the list.

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
Response: { correct: true }
Observation: The citation "[2]" correctly points to the second paper, where it states that birds can fly, confirming that the information in the statement is correct.

Example 2:
Statement: "God exists [1]."
Papers:
- Paper 1: "We found that dark matter is a form of energy."
- Paper 2: "We found that birds can indeed fly."
- Paper 3: "We found that global warming is real."
Response: { correct: false }
Observation: The citation "[1]" points to the first paper, where it states that dark matter is a form of energy, which is not related to the existence of God.

Now, complete the task outlined above for the following statement and papers:

Statement: "${statement}"
Papers:
${paperAbstracts.map((abstract, index) => `- Paper ${index + 1}: ${abstract}`).join("\n")}
`;
