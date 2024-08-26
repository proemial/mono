import { chatInputMaxLength } from "@/app/api/bot/input-limit";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { INTERNAL_COOKIE_NAME } from "@/app/hooks/use-user";
import { toLangChainChatHistory } from "@/app/llm/utils";
import { Message as VercelChatMessage } from "ai";
import { cookies } from "next/headers";
import { answerEngine } from "./answer-engine";

/**
 * @deprecated Use the new /api/ai endpoint instead.
 * This old endpoint will be removed in a future update.
 */
export async function handleAskRequest(requestData: {
	slug?: string;
	userId?: string;
	messages?: VercelChatMessage[];
	spaceId?: string;
}) {
	const { slug, userId: userIdFromHeader, messages, spaceId } = requestData;
	const { name, userId } = nameAndIdFromCookie(userIdFromHeader);
	const { input, chatHistory } = parseMessages(messages);

	if (!input?.content.length) {
		throw new Error("No question found");
	}
	if (input.content.length > chatInputMaxLength) {
		throw new Error("Input too long");
	}

	return answerEngine({
		chatHistory,
		userId,
		transactionId: input?.id,
		userInput: input?.content,
		existingSlug: slug || undefined,
		tags: name ? [name] : undefined,
		spaceId,
	});
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
