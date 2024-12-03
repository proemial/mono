import { UserContext, assistant } from "@/app/api/ai/ai-assistant";
import { AnswerEngineStreamData } from "@/app/api/bot/answer-engine/answer-engine";
import { openAlexChain } from "@/app/api/bot/ask2/fetch-papers";
import {
	ANONYMOUS_USER_ID,
	PAPER_BOT_USER_ID,
	getPersonalDefaultCollection,
} from "@/app/constants";
import { followUpQuestionChain } from "@/app/llm/chains/follow-up-questions-chain";
import { searchToolConfig } from "@/app/prompts/ask_agent";
import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { auth } from "@clerk/nextjs/server";
import { logBotBegin } from "@proemial/adapters/analytics/helicone";
import { findCollection } from "@proemial/data/repository/collection";
import { savePostWithComment } from "@proemial/data/repository/post";
import { prettySlug } from "@proemial/utils/pretty-slug";
import { uuid } from "@proemial/utils/uid";
import { Message, StreamData, convertToCoreMessages, streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
	const { success } = await ratelimitByIpAddress(req.ip);
	if (!success) {
		return NextResponse.json({ error: "Rate limited" }, { status: 429 });
	}
	const { userId } = auth();
	const requestData = (await req.json()) as {
		messages: Message[];
		title: string;
		paperId: string;
		spaceId: string;
		abstract: string;
	};

	const { messages, title, paperId, spaceId, abstract } = requestData;

	const userContext: UserContext = paperId
		? "paper"
		: spaceId
			? "space"
			: "global";

	const traceId = uuid();

	const convertedMessages = convertToCoreMessages(messages as any);
	const currentAssistant = await assistant(
		userContext,
		title,
		abstract,
		traceId,
	);
	console.log({ currentAssistant });
	const question = messages.findLast(
		(message: Message) => message.role === "user",
	)?.content as string;

	await logBotBegin("spaces", question, traceId);

	const data = new StreamData() as AnswerEngineStreamData;
	const result = streamText({
		...currentAssistant,
		messages: convertedMessages,
		tools:
			userContext !== "paper"
				? {
						searchPapersTool: {
							description: searchToolConfig.description,
							parameters: z.object({
								searchQuery: z
									.string()
									.describe("The original question asked by the user."),
							}),
							execute: async ({ searchQuery }: { searchQuery: string }) => {
								const result = await openAlexChain.invoke({
									question,
								});
								const output = JSON.parse(result.papers);
								return output;
							},
						},
					}
				: undefined,
		onFinish: async ({ finishReason, text }) => {
			if (finishReason === "stop") {
				const papers = messages
					.findLast(({ toolInvocations }) => Boolean(toolInvocations))
					?.toolInvocations?.find(
						({ toolName }) => toolName === "searchPapersTool",
						// @ts-expect-error
					)?.result;

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

				// Save the post and the AI reply
				const space =
					spaceId === userId
						? getPersonalDefaultCollection(userId)
						: await findCollection(spaceId);
				await savePostWithComment(
					{
						content: question,
						authorId: userId ?? ANONYMOUS_USER_ID,
						// Inherit the space's sharing setting, or `public` if no space
						shared: space?.shared ?? "public",
						spaceId: space?.id,
						paperId,
						slug: prettySlug(question),
					},
					{
						content: text,
						authorId: PAPER_BOT_USER_ID,
						followUps,
						papers,
					},
				);
			}
			data.close();
		},
	});

	return result.toDataStreamResponse({ data });
}
