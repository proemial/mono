import { AIMessage } from "@/app/api/bot/answer-engine/answer-engine";
import {
	INTERNAL_COOKIE_NAME,
	isInternalUser,
} from "@/app/components/analytics/is-internal-user";
import { toLangChainChatHistory } from "@/app/llm/utils";
import { Message as VercelChatMessage } from "ai";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { answerEngine } from "./answer-engine";
import { chatInputMaxLength } from "@/app/api/bot/input-limit";

// GPT-4 flag
// - Add the flag to the agent

// Feedback
// - Fix streaming with intermediate steps
//    - https://js.langchain.com/docs/modules/agents/how_to/streaming
// - Add intermediate step (or streamEvents) when a tool is triggered

// Integrate
// - Implement sharing
// - Invoke genration of followups

// LangSmith housekeeping
// - Rename parent run
// - Extract trace id from agent execution, and add it to the tools

const answerEngineRouteParams = z.object({
	slug: z.string().optional().nullable(),
	userId: z.string().optional(),
	messages: z.array(AIMessage),
});

export async function POST(req: NextRequest) {
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
	const { isInternal, name } = isInternalUser(email);

	return {
		isInternal,
		name,
		userId: userIdFromHeader ?? userIdFromCookie,
	};
}
