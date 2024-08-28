import { UserContext, assistant } from "@/app/api/ai/ai-assistant";
import { AnswerEngineStreamData } from "@/app/api/bot/answer-engine/answer-engine";
import { handleAskRequest } from "@/app/api/bot/ask2/handle-ask-request";
import {
	PAPER_BOT_USER_ID,
	getPersonalDefaultCollection,
} from "@/app/constants";
import { followUpQuestionChain } from "@/app/llm/chains/follow-up-questions-chain";
import { showAIAssistant } from "@/feature-flags/ai-assistant-flag";
import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { auth } from "@clerk/nextjs/server";
import { findCollection } from "@proemial/data/repository/collection";
import { savePostWithComment } from "@proemial/data/repository/post";
import { prettySlug } from "@proemial/utils/pretty-slug";
import { Message, StreamData, convertToCoreMessages, streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
	const { success } = await ratelimitByIpAddress(req.ip);
	if (!success) {
		return NextResponse.json({ error: "Rate limited" }, { status: 429 });
	}
	const { userId } = auth();
	const requestData = await req.json();
	const { messages, title, paperId, spaceId, abstract } = requestData;
	const showAIAssistantFeatureFlag = await showAIAssistant();

	const useDeprecatedAskAgent = !paperId && !showAIAssistantFeatureFlag;

	if (useDeprecatedAskAgent) {
		return await handleAskRequest(requestData);
	}

	const userContext: UserContext = paperId
		? "paper"
		: spaceId
			? "space"
			: "global";

	const convertedMessages = convertToCoreMessages(messages);
	const currentAssistant = assistant(userContext, title, abstract);
	const question = messages.findLast(
		(message: Message) => message.role === "user",
	)?.content;

	const data = new StreamData() as AnswerEngineStreamData;
	const result = await streamText({
		...currentAssistant,
		messages: convertedMessages,
		onFinish: async ({ finishReason, text }) => {
			if (finishReason === "stop") {
				// Generate follow-ups
				const followUps = await followUpQuestionChain()
					.invoke({
						question,
						answer: text,
					})
					.then((followUpsAsString) =>
						followUpsAsString
							.split("?")
							.filter((f) => typeof f !== "undefined" && f.length > 0)
							.map((f) => `${f.trim()}?`),
					);
				data.append({
					type: "follow-up-questions-generated",
					transactionId: "foo",
					data: followUps.map((question) => ({
						question,
					})),
				});

				// Save the post and the AI reply, if the user is signed in
				if (userId) {
					const space =
						spaceId === userId
							? getPersonalDefaultCollection(userId)
							: await findCollection(spaceId);
					await savePostWithComment(
						{
							content: question,
							authorId: userId,
							paperId,
							// Inherit the space's sharing setting, or `public` if no space
							shared: space?.shared ?? "public",
							spaceId: space?.id,
							slug: prettySlug(question),
						},
						{
							content: text,
							authorId: PAPER_BOT_USER_ID,
							followUps,
						},
					);
				}
			}
			data.close();
		},
	});

	return result.toDataStreamResponse({ data });
}
