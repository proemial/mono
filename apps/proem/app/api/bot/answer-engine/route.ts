import { askAnswerEngine } from "@/app/api/bot/answer-engine/answer-engine";
import { isInternalUser } from "@/app/components/analytics/is-internal-user";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const { messages = [], slug, userId, userEmail } = await req.json();
	const { name: internalUserName } = isInternalUser(userEmail);

	const chatHistory = messages.slice(0, -1);
	const question = messages[messages.length - 1]!.content;
	const tags = internalUserName ? [internalUserName] : undefined;

	const stream = askAnswerEngine({
		question,
		chatHistory,
		existingSlug: slug,
		userId,
		tags,
	});

	return stream;
}
