import { NextRequest, NextResponse } from "next/server";
import { Time } from "@proemial/utils/time";
import { answerQuestion } from "../../answer/answer";

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
		const { question, answer: expectedAnswer, options } = result[5];
		const { answer: actualAnswer } = await answerQuestion(
			collection,
			question,
			options?.map((option) =>
				typeof option === "string" ? option : option.text,
			),
		);
		// TODO: Sentiment analysis, score and aggregate score

		return NextResponse.json({
			question,
			expectedAnswer,
			actualAnswer,
		});
	} finally {
		Time.log(begin, `[qa][answers] parsed ${result?.length} questions`);
	}
};
