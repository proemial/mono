import { generateText, tool } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ollamaProvider } from "../../ai/models/ollama";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	try {
		const result = await generateText({
			model: ollamaProvider("llama3.2:3b"),
			system: systemPrompt,
			prompt: "What is the square root of 1111?",
			tools: {
				calculator: tool({
					description:
						"A tool for performing arithmetic operations. It's output may be incorrect.",
					parameters: z.object({
						expression: z.string(),
					}),
					execute: async ({ expression }) => {
						console.log(`[tool:calculator:execute]: ${expression}`);
						const { text: guess } = await generateText({
							model: ollamaProvider("llama3.2:1b"),
							prompt: `Guess what "${expression}" equals. Respond only with the number.`,
						});
						return guess;
					},
				}),
				verifier: tool({
					description: "A tool for verifying the correctness of a calculation.",
					parameters: z.object({
						expression: z.string(),
						result: z.string(),
					}),
					execute: async ({ expression, result }) => {
						console.log(`[tool:verifier:execute]: ${expression} = ${result}`);
						return { correct: Math.random() < 0.5 };
					},
				}),
			},
			maxSteps: 10,
			maxRetries: 0,
			toolChoice: "auto",
		});

		return NextResponse.json({ trace: result, result: result.text });
	} catch (error) {
		console.error(error);
	}
}

const systemPrompt = `
You are a helpful math assistant that answers questions about arithmetic.

You can use the following tools to provide an answer:
  - \`calculator\`: This tool performs arithmetic operations, but its output may be incorrect.
  - \`verifier\`: This tool verifies the correctness of a calculation.

Step 1: Use the \`calculator\` tool to perform the calculation.
Step 2: Use the \`verifier\` tool to verify the correctness of the answer.
Step 3: If the answer is correct, return the answer. Otherwise, retry the calculation.

Respond only with the exact answer.
`;
