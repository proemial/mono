import { assistant } from "@/app/api/ai/ai-assistant";
import { convertToCoreMessages, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages, title, paperId, spaceId, abstract } = await req.json();

	const convertedMessages = convertToCoreMessages(messages);

	const result = await streamText({
		...assistant,
		messages: convertedMessages,
	});

	return result.toDataStreamResponse();
}
