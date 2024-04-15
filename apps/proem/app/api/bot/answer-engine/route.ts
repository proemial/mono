import {
	AIMessage,
	askAnswerEngine,
} from "@/app/api/bot/answer-engine/answer-engine";
import { INTERNAL_COOKIE_NAME, getInternalUser } from "@/app/hooks/use-user";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { z } from "zod";

export const maxDuration = 30;

const answerEngineRouteParams = z.object({
	slug: z.string().optional().nullable(),
	userId: z.string().optional(),
	messages: z.array(AIMessage),
});

export async function POST(req: NextRequest) {
	const body = await req.json();
	const {
		slug,
		userId: userIdFromHeader,
		messages,
	} = answerEngineRouteParams.parse(body);

	const { name, userId } = nameAndIdFromCookie(userIdFromHeader);

	const chatHistory = messages.slice(0, -1);
	const newestQuestion = messages.at(-1);
	if (!newestQuestion) {
		throw new Error("No question found");
	}

	const stream = askAnswerEngine({
		chatHistory,
		userId,
		transactionId: newestQuestion.id,
		question: newestQuestion.content,
		existingSlug: slug || undefined,
		tags: name ? [name] : undefined,
	});

	return stream;
}

function nameAndIdFromCookie(userIdFromHeader?: string) {
	const cookie = cookies().get(INTERNAL_COOKIE_NAME)?.value ?? "";
	if (!cookie) {
		return {
			isInternal: false,
			userId: userIdFromHeader,
		};
	}

	const { email, userId: userIdFromCookie } = JSON.parse(cookie) as {
		email?: string;
		userId?: string;
	};
	const { isInternal, proemialName: name } = getInternalUser(email);

	return {
		isInternal,
		name,
		userId: userIdFromHeader ?? userIdFromCookie,
	};
}
