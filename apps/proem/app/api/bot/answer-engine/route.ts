import { askAnswerEngine } from "@/app/api/bot/answer-engine/answer-engine";
import {
	INTERNAL_COOKIE_NAME,
	isInternalUser,
} from "@/app/components/analytics/is-internal-user";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const { messages = [], slug, userId: userIdFromHeader } = await req.json();

	const { name, userId } = nameAndIdFromCookie(userIdFromHeader);

	const chatHistory = messages.slice(0, -1);
	const question = messages[messages.length - 1]?.content;
	const tags = name ? [name] : undefined;

	const stream = askAnswerEngine({
		question,
		chatHistory,
		existingSlug: slug,
		userId,
		tags,
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
	const { isInternal, name } = isInternalUser(email);

	return {
		isInternal,
		name,
		userId: userIdFromHeader ?? userIdFromCookie,
	};
}
