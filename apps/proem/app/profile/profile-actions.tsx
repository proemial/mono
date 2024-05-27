"use server";

import { answers } from "@/app/api/bot/answer-engine/answers";
import { auth } from "@clerk/nextjs/server";

export async function fetchQuestionsForCurrentUser() {
	const { userId } = auth();
	if (!userId) {
		return [];
	}

	const answersByCurrentUser = await answers.getByUserId(userId);

	return answersByCurrentUser.map((answer) => ({
		id: answer.id,
		question: answer.question,
		slug: answer.slug,
	}));
}
