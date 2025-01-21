import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import LlmModels from "@proemial/adapters/llm/models";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { answerQuestion } from "../../answer/answer";

export type Question = {
	id: number;
	automatable: boolean;
	question: string;
	options?: Array<string | { text: string }>;
	answer?: string;
};

export const evaluateQuestionaire = async (
	questions: Question[],
	collection: string,
) => {
	const noOfAutomatableQuestions = questions.filter(
		(q) => q.automatable,
	).length;
	console.log(
		`[qa][answers] noOfAutomatableQuestions: ${noOfAutomatableQuestions}`,
	);

	const results = [];
	for (const q of questions) {
		const { id, automatable, question, options, answer: expectedAnswer } = q;

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

		console.log(`[qa][answers] fact-checking answer to question ${id}…`);
		const grounding = await factCheck(
			actualAnswer,
			references.map((r) => r.source),
		);

		console.log(
			`[qa][answers] analyzing similarity of answers to question ${id}…`,
		);
		const similarityAnalysis = await analyzeSimilarity(
			expectedAnswer,
			actualAnswer,
		);

		results.push({
			id,
			question,
			options,
			expectedAnswer,
			actualAnswer,
			similarityAnalysis,
			references,
			groundingScore: grounding.score,
		});
	}

	const resultsWithSimilarityAnalysis = results.filter(
		(r) => r.similarityAnalysis,
	);
	const averageSimilarityScore = toTwoDigits(
		resultsWithSimilarityAnalysis
			// biome-ignore lint/style/noNonNullAssertion: We filter out undefined above
			.reduce((acc, r) => acc + r.similarityAnalysis!.score, 0) /
			resultsWithSimilarityAnalysis.length,
	);

	return {
		noOfAutomatableQuestions,
		results,
		averageSimilarityScore,
	};
};

const analyzeSimilarity = async (
	expectedAnswer: string,
	actualAnswer: string,
) => {
	const { object } = await generateObject({
		model: LlmModels.api.similarityAnalysis(),
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
		schemaName: "similarityAnalysis",
		schemaDescription:
			"Similarity analysis of the actual answer compared to the expected answer.",
		system: `
			You are a similarity analysis model that compares an expected answer to an actual answer and returns whether or not they are semantically similar. You also include a score between 0 and 1, with 1 being the highest similarity and 0 being the lowest similarity between the two answers. Finally, you return a very brief description of the reasoning behind the score, explaining the value given, using a maximum of 40 words or so.
			`,
		prompt: `
			Expected answer: ${expectedAnswer}
			Actual answer: ${actualAnswer}
			`,
		temperature: 0,
	});

	return object;
};

const factCheck = async (answer: string, references: string[]) => {
	// In order to fact-check a multi-sentence claim, the claim should first be broken up into sentences to achieve optimal performance.
	// Source: https://github.com/Liyan06/MiniCheck
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 200,
		chunkOverlap: 1,
	});
	const sentences = (await splitter.createDocuments([answer])).map(
		(d) => d.pageContent,
	);

	const generationPromises = sentences.map((sentence) =>
		generateText({
			model: LlmModels.api.factChecking(),
			prompt: `
					Document: ${references.join("\n\n")}
					Claim: ${sentence}
			`,
		}),
	);
	const results = await Promise.all(generationPromises);

	// console.log("sentences", sentences);
	// console.log(
	// 	"results",
	// 	results.map((r) => r.text),
	// );

	const allClaimsSupported = results.every(
		(r) => r.text.toLowerCase() === "yes",
	);
	const sentenceAverage = toTwoDigits(
		results.reduce(
			(acc, r) => acc + (r.text.toLowerCase() === "yes" ? 1 : 0),
			0,
		) / results.length,
	);

	return {
		allClaimsSupported,
		score: sentenceAverage,
	};
};

const toTwoDigits = (n: number) => Number.parseFloat(n.toFixed(2));
