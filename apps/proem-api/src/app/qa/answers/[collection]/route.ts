import { NextRequest, NextResponse } from "next/server";
import { Time } from "@proemial/utils/time";
import { answerQuestion } from "../../answer/answer";
import { generateText, generateObject } from "ai";
import LlmModels from "@proemial/adapters/llm/models";
import { z } from "zod";

type Question = {
	id: number;
	automatable: boolean;
	question: string;
	options?: Array<string | { text: string }>;
	answer?: string;
};

// Usage:
// curl http://127.0.0.1:3000/qa/answers/bunker -F "file=@/Users/bp/work/repos/proem/apps/proem-api/src/app/qa/answers/[collection]/testdata.json"
export const POST = async (
	request: NextRequest,
	{ params }: { params: Promise<{ collection: string }> },
) => {
	const { collection } = await params;
	console.log(`[qa][answers] collection: ${collection}`);

	const begin = Time.now();
	let result: Question[] | undefined = undefined;

	try {
		const formData = await request.formData();
		const file = formData.get("file");
		if (!file || !(file instanceof File)) {
			return NextResponse.json({ error: "No file received" }, { status: 400 });
		}

		const fileText = await file.text();
		result = JSON.parse(fileText) as Question[];

		// TODO: Loop and ignore non-automatable questions
		const noOfAutomatableQuestions = result.filter((q) => q.automatable).length;
		console.log(
			`[qa][answers] noOfAutomatableQuestions: ${noOfAutomatableQuestions}`,
		);

		const { question, answer: expectedAnswer, options } = result[5];
		const { answer: actualAnswer } = await answerQuestion(
			collection,
			question,
			options?.map((option) =>
				typeof option === "string" ? option : option.text,
			),
		);
		if (!expectedAnswer) {
			return NextResponse.json(
				{ error: "No expected answer for this question" },
				{ status: 400 },
			);
		}
		const sentimentAnalysis = await analyzeSentiment(
			expectedAnswer,
			actualAnswer,
		);

		return NextResponse.json({
			question,
			expectedAnswer,
			actualAnswer,
			sentimentAnalysis,
		});
	} finally {
		Time.log(begin, `[qa][answers] parsed ${result?.length} questions`);
	}
};

const analyzeSentiment = async (
	expectedAnswer: string,
	actualAnswer: string,
) => {
	const { object } = await generateObject({
		model: LlmModels.api.sentimentAnalysis(),
		schema: z.object({
			similar: z.boolean(),
			score: z.number(),
		}),
		prompt: `
			Given the following expected answer: ${expectedAnswer}
			And the following actual answer: ${actualAnswer}
			Using sentiment analysis, compare the actual answer to the expected answer and return whether or not the answer is semantically similar in its meaning. Also return a score between 0 and 1, with 1 being the highest similarity and 0 being the lowest similarity between the two answers.
			`,
	});

	return object;
};
