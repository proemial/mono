import { UserContext, assistant } from "@/app/api/ai/ai-assistant";
import { convertToCoreMessages, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages, title, paperId, spaceId, abstract } = await req.json();

	const userContext: UserContext = paperId
		? "paper"
		: spaceId
			? "space"
			: "global";

	console.log("userContext", userContext);

	const convertedMessages = convertToCoreMessages(messages);
	const currentAssistant = assistant(userContext, title, abstract);
	console.log(currentAssistant);

	const result = await streamText({
		...currentAssistant,
		messages: convertedMessages,
	});

	return result.toDataStreamResponse();
}
