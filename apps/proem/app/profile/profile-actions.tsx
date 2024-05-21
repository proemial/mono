"use server";

import { answers } from "@/app/api/bot/answer-engine/answers";
import { auth } from "@clerk/nextjs/server";

export async function fetchQuestionsForCurrentUser() {
	// TODO! auth
	const { userId } = auth();
	if (!userId) {
		throw new Error("No user id");
	}

	console.log(userId);
	const answersByCurrentUser = await answers.getByUserId(userId);

	console.log(answersByCurrentUser);
	// const res = await fetch(`/api/questions?userId=${userId}`);
	// return res.json();
	return answersByCurrentUser.map((answer) => ({
		id: answer.id,
		question: answer.question,
		slug: answer.slug,
	}));
}
