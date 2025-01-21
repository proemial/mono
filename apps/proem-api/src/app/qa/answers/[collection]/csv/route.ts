import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { evaluateQuestionaire, Question } from "../questionaire";
import { createObjectCsvStringifier } from "csv-writer";

// Usage:
// curl http://127.0.0.1:3000/qa/answers/bunker/csv -F "file=@/Users/bp/work/repos/proem/apps/proem-api/src/app/qa/answers/[collection]/testdata.json"
export const POST = async (
	request: NextRequest,
	{ params }: { params: Promise<{ collection: string }> },
) => {
	const { collection } = await params;
	console.log(`[qa][answers] collection: ${collection}`);

	const begin = Time.now();
	let questions: Question[] | undefined = undefined;

	try {
		const formData = await request.formData();
		const file = formData.get("file");
		if (!file || !(file instanceof File)) {
			return NextResponse.json({ error: "No file received" }, { status: 400 });
		}

		const fileText = await file.text();
		questions = JSON.parse(fileText) as Question[];

		const { noOfAutomatableQuestions, results, averageSimilarityScore } =
			await evaluateQuestionaire(questions, collection);

		const csv = generateCsv(
			noOfAutomatableQuestions,
			results,
			averageSimilarityScore,
		);

		return new NextResponse(csv);
	} finally {
		Time.log(begin, `[qa][answers] parsed ${questions?.length} questions`);
	}
};

const generateCsv = (
	noOfAutomatableQuestions: number,
	results: Awaited<ReturnType<typeof evaluateQuestionaire>>["results"],
	averageSimilarityScore: number,
) => {
	const csvStringifier = createObjectCsvStringifier({
		header: [
			{ id: "id", title: "ID" },
			{ id: "question", title: "QUESTION" },
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

	const records = results.map((result) => ({
		id: result.id,
		question: result.question,
		expectedAnswer: result.expectedAnswer,
		actualAnswer: result.actualAnswer,
		similarity: result.similarityAnalysis.similar ? "Yes" : "No",
		similarityScore: result.similarityAnalysis.score,
		similarityReasoning: result.similarityAnalysis.reasoning,
		reference1: result.references[0]?.source,
		reference2: result.references[1]?.source,
		reference3: result.references[2]?.source,
		groundingScore: result.groundingScore,
	}));
	records.push({
		// @ts-ignore - Fields are not part of the main record type, but needed for the final summary row
		averageSimilarityScore: averageSimilarityScore,
		noOfAutomatableQuestions: noOfAutomatableQuestions,
	});

	const headers = csvStringifier.getHeaderString();
	const data = csvStringifier.stringifyRecords(records);
	const blobData = `${headers}${data}`;

	return Buffer.from(blobData, "utf-8");
};
