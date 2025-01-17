import { NextResponse } from "next/server";
import { answerQuestion } from "./answer";

export const revalidate = 0;

export const POST = async (request: Request) => {
	const { question, collection } = await request.json();

	const { answer, references } = await answerQuestion(question, collection);

	return NextResponse.json({ answer, references });
};
