import { chatInputMaxLength } from "@/app/api/bot/input-limit";
import { PAPER_BOT_USER_ID } from "@/app/constants";
import { context, model, question } from "@/app/prompts/chat";
import { openAIApiKey, openaiOrganizations } from "@/app/prompts/openai-keys";
import { ratelimitRequest } from "@/utils/ratelimiter";
import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { NewPaper, NewUser, papers, users } from "@proemial/data/neon/schema";
import { NewComment, comments } from "@proemial/data/neon/schema/comments";
import { NewPost, posts } from "@proemial/data/neon/schema/posts";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
	apiKey: openAIApiKey,
	organization: openaiOrganizations.read,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: NextRequest) {
	const { success } = await ratelimitRequest(req);
	if (!success) {
		return NextResponse.json({ error: "Rate limited" }, { status: 429 });
	}

	const { messages, title, paperId, abstract } = await req.json();
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

	// Ask OpenAI for a streaming completion given the prompt
	const response = await openai.createChatCompletion({
		model,
		stream: true,
		messages: moddedMessages,
	});
	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response, {
		onFinal: async (completion) => {
			const { userId } = auth();
			if (userId) {
				await savePostAndReply(
					{
						id: paperId,
					},
					{
						id: userId,
					},
					{
						content: postContent,
						authorId: userId,
						paperId,
					},
					completion,
				);
			}
		},
	});
	// Respond with the stream
	return new StreamingTextResponse(stream);
}

const savePostAndReply = async (
	paper: NewPaper,
	user: NewUser,
	post: NewPost,
	commentContent: NewComment["content"],
) => {
	// Create paper and user if not already exists
	await Promise.all([
		neonDb.insert(papers).values(paper).onConflictDoNothing(),
		neonDb.insert(users).values(user).onConflictDoNothing(),
	]);
	// Save post
	const insertedPost = await neonDb
		.insert(posts)
		.values(post)
		.returning({ id: posts.id });
	if (insertedPost[0]) {
		// Save paper bot reply
		await neonDb.insert(comments).values({
			content: commentContent,
			authorId: PAPER_BOT_USER_ID,
			postId: insertedPost[0].id,
		});
	}
};
