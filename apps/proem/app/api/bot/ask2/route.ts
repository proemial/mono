import { AIMessage } from "@/app/api/bot/answer-engine/answer-engine";
import { chatInputMaxLength } from "@/app/api/bot/input-limit";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { INTERNAL_COOKIE_NAME } from "@/app/hooks/use-user";
import { toLangChainChatHistory } from "@/app/llm/utils";
import { ratelimitRequest } from "@/utils/ratelimiter";
import { Message as VercelChatMessage } from "ai";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { answerEngine } from "./answer-engine";

export const maxDuration = 30;

const answerEngineRouteParams = z.object({
	slug: z.string().optional().nullable(),
	userId: z.string().optional(),
	messages: z.array(AIMessage),
});

export async function POST(req: NextRequest) {
	const { success } = await ratelimitRequest(req);
	if (!success) {
		return NextResponse.json({ error: "Rate limited" }, { status: 429 });
	}

	try {
		const body = await req.json();
		const {
			slug,
			userId: userIdFromHeader,
			messages,
		} = answerEngineRouteParams.parse(body);

		const { name, userId } = nameAndIdFromCookie(userIdFromHeader);
		const { input, chatHistory } = parseMessages(messages);

		if (!input?.content.length) {
			throw new Error("No question found");
		}
		if (input.content.length > chatInputMaxLength) {
			throw new Error("Input too long");
		}

		const stream = answerEngine({
			chatHistory,
			userId,
			transactionId: input?.id,
			userInput: input?.content,
			existingSlug: slug || undefined,
			tags: name ? [name] : undefined,
		});

		return stream;
	} catch (e) {
		return NextResponse.json(e, { status: 500 });
	}
}

function parseMessages(chatMessages?: VercelChatMessage[]) {
	const messages = (chatMessages ?? []).filter(
		(message: VercelChatMessage) =>
			message.role === "user" || message.role === "assistant",
	);
	const chatHistory = messages.slice(0, -1).map(toLangChainChatHistory);
	const input = messages[messages.length - 1];

	return { input, chatHistory };
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
