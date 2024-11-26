import {
	AIMessage,
	askAnswerEngine,
} from "@/app/api/bot/answer-engine/answer-engine";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { INTERNAL_COOKIE_NAME } from "@/app/hooks/use-user";
import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 30;

const answerEngineRouteParams = z.object({
	slug: z.string().optional().nullable(),
	userId: z.string().optional(),
	messages: z.array(AIMessage),
});

/**
 * @deprecated This endpoint has not been kept up-to-date - use "/api/bot/ask2" instead!
 */
export async function POST(req: NextRequest) {
	const { success } = await ratelimitByIpAddress(req.ip);
	if (!success) {
		return NextResponse.json({ error: "Rate limited" }, { status: 429 });
	}

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

	const { stream, data } = await askAnswerEngine({
		chatHistory,
		userId,
		transactionId: newestQuestion.id,
		question: newestQuestion.content,
		existingSlug: slug || undefined,
		tags: name ? [name] : undefined,
	});

	return NextResponse.json(
		{ error: "This answer engine is no longer supported (since AI SDK v4.0)" },
		{ status: 404 },
	);
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
