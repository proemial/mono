"use server";

import { answers } from "@/app/api/bot/answer-engine/answers";
import { auth } from "@clerk/nextjs/server";

export async function fetchQuestionsForCurrentUser() {
	const { userId } = auth();
	if (!userId) {
		return [];
	}

	return answers.getByUserId(userId);
}
