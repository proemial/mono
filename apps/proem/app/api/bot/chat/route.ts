import { chatInputMaxLength } from "@/app/api/bot/input-limit";
import {
	PAPER_BOT_USER_ID,
	getPersonalDefaultCollection,
} from "@/app/constants";
import { followUpQuestionChain } from "@/app/llm/chains/follow-up-questions-chain";
import { context, model, question } from "@/app/prompts/chat";
import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { auth } from "@clerk/nextjs/server";
import { findCollection } from "@proemial/data/repository/collection";
import { savePostWithComment } from "@proemial/data/repository/post";
import { prettySlug } from "@proemial/utils/pretty-slug";
import { StreamData, streamText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

/**
 * @deprecated This route is deprecated. Please use the AI Assistant route instead.
 */
export async function POST(req: NextRequest) {
	const { success } = await ratelimitByIpAddress(req.ip);
	if (!success) {
		return NextResponse.json({ error: "Rate limited" }, { status: 429 });
	}

	const { messages, title, paperId, spaceId, abstract } = await req.json();
	const postContent = messages.at(-1).content;

	const moddedMessages = [context(title, abstract), ...messages];
	const prompt = question(model);

	const lastMessage = moddedMessages.at(-1);
	if (lastMessage.role === "user") {
		if (lastMessage.content.length > chatInputMaxLength) {
			throw new Error("Input too long");
		}

		// TODO: Why does is start with `!!`?
		if (!lastMessage.content.startsWith("!!"))
			lastMessage.content = `${prompt} ${lastMessage.content}`;
		else lastMessage.content = lastMessage.content.substring(2); // Remove the `!!`
	}

	const streamData = new StreamData();

	const result = streamText({
		model: openai(model),
		messages: moddedMessages,
		onFinish: async (completion) => {
			// Generate follow-ups
			const followUps = await followUpQuestionChain().invoke({
				question: postContent,
				answer: completion.text,
			});
			streamData.append({
				type: "follow-up-questions-generated",
				transactionId: "foo",
				data: followUps
					.split("?")
					.filter(Boolean)
					.map((question) => ({ question: `${question.trim()}?` })),
			});
			streamData.close();

			const { userId } = auth();
			// Save the post and the AI reply, if the user is signed in
			if (userId) {
				const space =
					spaceId === userId
						? getPersonalDefaultCollection(userId)
						: await findCollection(spaceId);
				await savePostWithComment(
					{
						content: postContent,
						authorId: userId,
						paperId,
						// Inherit the space's sharing setting, or `public` if no space
						shared: space?.shared ?? "public",
						spaceId: space?.id,
						slug: prettySlug(postContent),
					},
					{
						content: completion.text,
						authorId: PAPER_BOT_USER_ID,
						followUps: followUps
							.split("?")
							.filter((f) => typeof f !== "undefined" && f.length > 0)
							.map((f) => `${f.trim()}?`),
					},
				);
			}
		},
	});

	return result.toDataStreamResponse({ data: streamData });
}
