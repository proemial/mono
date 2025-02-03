import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { evaluateQuestionnaire, Question } from "./questionaire";

// Usage:
// curl http://127.0.0.1:3000/qa/answers/bunker -F "file=@/Users/bp/work/repos/proem/apps/proem-api/src/app/qa/answers/[collection]/testdata.json"
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
			await evaluateQuestionnaire(questions, collection);

		return NextResponse.json({
			noOfAutomatableQuestions,
			results,
			averageSimilarityScore,
		});
	} finally {
		Time.log(begin, `[qa][answers] parsed ${questions?.length} questions`);
	}
};
