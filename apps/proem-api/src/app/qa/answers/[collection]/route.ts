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

		const noOfAutomatableQuestions = result.filter((q) => q.automatable).length;
		console.log(
			`[qa][answers] noOfAutomatableQuestions: ${noOfAutomatableQuestions}`,
		);

		const results = [];
		for (const r of result) {
			const { id, automatable, question, options, answer: expectedAnswer } = r;

			if (!automatable) {
				continue;
			}
			if (!expectedAnswer) {
				console.warn(
					`[qa][answers] No expected answer for question ${id} - skipping`,
				);
				continue;
			}

			console.log(`[qa][answers] answering question ${id}…`);
			const { answer: actualAnswer, references } = await answerQuestion(
				collection,
				question,
				options?.map((option) =>
					typeof option === "string" ? option : option.text,
				),
			);
			console.log(`[qa][answers] analyzing sentiment for question ${id}…`);
			const sentimentAnalysis = await analyzeSentiment(
				expectedAnswer,
				actualAnswer,
			);

			const top3References = references
				.map((r) => ({
					source: r.payload?.text,
					score: r.score,
				}))
				.sort((a, b) => b.score - a.score)
				.slice(0, 3);

			results.push({
				id,
				question,
				expectedAnswer,
				actualAnswer,
				sentimentAnalysis,
				references: top3References,
			});
		}

		const resultsWithSentimentAnalysis = results.filter(
			(r) => r.sentimentAnalysis,
		);
		const averageSentimentScore = (
			resultsWithSentimentAnalysis
				// biome-ignore lint/style/noNonNullAssertion: We filter out undefined above
				.reduce((acc, r) => acc + r.sentimentAnalysis!.score, 0) /
			resultsWithSentimentAnalysis.length
		).toFixed(2);

		return NextResponse.json({
			noOfAutomatableQuestions,
			results,
			averageSentimentScore,
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
			similar: z
				.boolean()
				.describe(
					"Whether the actual answer is semantically similar to the expected answer.",
				),
			score: z
				.number()
				.describe(
					"A score between 0 and 1, with 1 being the highest similarity and 0 being the lowest similarity between the two answers.",
				),
			reasoning: z
				.string()
				.describe(
					"A very brief description of the reasoning behind the score, explaining the value given, using a maximum of 40 words or so.",
				),
		}),
		schemaName: "sentimentAnalysis",
		schemaDescription:
			"Sentiment analysis of the actual answer compared to the expected answer.",
		system: `
			You are a sentiment analysis model that compares an expected answer to an actual answer and returns whether or not they are semantically similar. You also include a score between 0 and 1, with 1 being the highest similarity and 0 being the lowest similarity between the two answers. Finally, you return a very brief description of the reasoning behind the score, explaining the value given, using a maximum of 40 words or so.
			`,
		prompt: `
			Expected answer: ${expectedAnswer}
			Actual answer: ${actualAnswer}
			`,
		temperature: 0,
	});

	return object;
};
