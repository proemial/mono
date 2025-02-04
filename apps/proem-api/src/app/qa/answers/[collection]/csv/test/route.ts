import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { evaluateQuestionnaire, Question } from "../../questionaire";
import { createObjectCsvStringifier } from "csv-writer";
import { RemoteOllamaClient } from "@proemial/adapters/remote-ollama/remote-ollama-client";

export const maxDuration = 300;

// Usage:
// curl -o foo.csv http://127.0.0.1:3000/qa/answers/bunker/csv/test \
//   -F "file=@<absolute path to mono repo>/apps/proem-api/src/app/qa/answers/[collection]/testdata.json"
//   -F "keepInstanceRunning=false"
//   -F "fastInstance=false"

/**
 * Test route, only goes through a subset of the questionnaire.
 */
export const POST = async (
	request: NextRequest,
	{ params }: { params: Promise<{ collection: string }> },
) => {
	const { collection } = await params;
	console.log(`Collection: ${collection}`);

	const begin = Time.now();
	let questions: Question[] | undefined = undefined;

	try {
		const formData = await request.formData();
		const file = formData.get("file");
		if (!file || !(file instanceof File)) {
			return NextResponse.json({ error: "No file received" }, { status: 400 });
		}
		// Optional flag to keep the instance running after evaluation finishes
		const keepInstanceRunning = formData.get("keepInstanceRunning") === "true";

		const fileText = await file.text();
		questions = JSON.parse(fileText) as Question[];

		// Only traverse 5 questions (first 5 are not automatable)
		questions = questions.slice(6, 11);

		const fastInstance = formData.get("fastInstance") === "true";
		const ollamaClient = RemoteOllamaClient.create(
			fastInstance ? "fast" : "slow",
		);
		await ollamaClient.startInstance();

		let csv: Buffer<ArrayBuffer> | undefined = undefined;
		try {
			const evaluation = await evaluateQuestionnaire(questions, collection, {
				embedding: ollamaClient.getEmbeddingModel("nomic-embed-text:v1.5"),
				answering: ollamaClient.getChatModel("llama3.1:8b"),
				grounding: ollamaClient.getChatModel("bespoke-minicheck:7b"),
			});
			csv = generateCsv(evaluation);
			await stopInstance(ollamaClient, keepInstanceRunning);
		} catch (error) {
			await stopInstance(ollamaClient, keepInstanceRunning);
			throw error;
		}

		return new NextResponse(csv);
	} finally {
		Time.log(begin, `Parsed ${questions?.length} questions`);
	}
};

const generateCsv = (
	evaluation: Awaited<ReturnType<typeof evaluateQuestionnaire>>,
) => {
	const csvStringifier = createObjectCsvStringifier({
		header: [
			{ id: "id", title: "ID" },
			{ id: "question", title: "QUESTION" },
			{ id: "options", title: "OPTIONS" },
			{ id: "expectedAnswer", title: "EXPECTED ANSWER" },
			{ id: "actualAnswer", title: "ACTUAL ANSWER" },
			{ id: "similarity", title: "SIMILARITY" },
			{ id: "similarityScore", title: "SIMILARITY SCORE" },
			{ id: "similarityReasoning", title: "SIMILARITY REASONING" },
			{ id: "reference1", title: "REFERENCE 1" },
			{ id: "reference2", title: "REFERENCE 2" },
			{ id: "reference3", title: "REFERENCE 3" },
			{ id: "groundingScore", title: "GROUNDING SCORE" },
			{ id: "averageSimilarityScore", title: "AVERAGE SIMILARITY SCORE" },
			{ id: "noOfAutomatableQuestions", title: "NO. OF AUTOMATABLE QUESTIONS" },
		],
		fieldDelimiter: ";",
	});

	const formatReference = (reference: {
		filename: string;
		position: number[] | undefined;
		source: string;
		score: number;
	}) => {
		const formattedPosition = reference.position
			? ` [${reference.position.join("-")}]`
			: "";
		return `${reference.filename}${formattedPosition} (${reference.score})\n\n${reference.source}`;
	};

	const records = evaluation.results.map((result) => ({
		id: result.id,
		question: result.question,
		options: result.options ? "Yes" : "No",
		expectedAnswer: result.expectedAnswer,
		actualAnswer: result.actualAnswer,
		similarity: result.similarityAnalysis.similar ? "Yes" : "No",
		similarityScore: result.similarityAnalysis.score,
		similarityReasoning: result.similarityAnalysis.reasoning,
		reference1: formatReference(result.references[0]),
		reference2: formatReference(result.references[1]),
		reference3: formatReference(result.references[2]),
		groundingScore: result.groundingScore,
	}));
	records.push({
		// @ts-ignore - Fields are not part of the main record type, but needed for the final summary row
		averageSimilarityScore: evaluation.averageSimilarityScore,
		noOfAutomatableQuestions: evaluation.noOfAutomatableQuestions,
	});

	const headers = csvStringifier.getHeaderString();
	const data = csvStringifier.stringifyRecords(records);
	const blobData = `${headers}${data}`;

	return Buffer.from(blobData, "utf-8");
};

const stopInstance = async (
	ollamaClient: RemoteOllamaClient,
	keepRunning: boolean,
) => {
	if (keepRunning) {
		console.warn("Instance will continue running after evaluation");
	} else {
		await ollamaClient.stopInstance({ waitForStop: false });
	}
};
