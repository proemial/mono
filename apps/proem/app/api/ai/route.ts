import { UserContext, assistant } from "@/app/api/ai/ai-assistant";
import {
	PAPER_BOT_USER_ID,
	getPersonalDefaultCollection,
} from "@/app/constants";
import { auth } from "@clerk/nextjs/server";
import { findCollection } from "@proemial/data/repository/collection";
import { savePostWithComment } from "@proemial/data/repository/post";
import { prettySlug } from "@proemial/utils/pretty-slug";
import { convertToCoreMessages, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { userId } = auth();
	const { messages, title, paperId, spaceId, abstract } = await req.json();

	const userContext: UserContext = paperId
		? "paper"
		: spaceId
			? "space"
			: "global";

	const convertedMessages = convertToCoreMessages(messages);
	const currentAssistant = assistant(userContext, title, abstract);

	const result = await streamText({
		...currentAssistant,
		messages: convertedMessages,
		onFinish: async ({ finishReason, text }) => {
			if (finishReason === "stop") {
				if (userId) {
					// Save the post and the AI reply, if the user is signed in
					const space =
						spaceId === userId
							? getPersonalDefaultCollection(userId)
							: await findCollection(spaceId);
					await savePostWithComment(
						{
							content: messages.at(-1)?.content,
							authorId: userId,
							paperId,
							// Inherit the space's sharing setting, or `public` if no space
							shared: space?.shared ?? "public",
							spaceId: space?.id,
							slug: prettySlug(messages.at(-1)?.content),
						},
						{
							content: text,
							authorId: PAPER_BOT_USER_ID,
						},
					);
				}
			}
		},
	});

	return result.toDataStreamResponse();
}
