"use server";

import { answers } from "@proemial/data/repository/answer";
import { auth } from "@clerk/nextjs/server";

export async function fetchQuestionsForCurrentUser() {
	const { userId } = auth();
	if (!userId) {
		return [];
	}

	return answers.getByUserId(userId);
}
