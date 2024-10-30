import { convertToCoreMessages } from "ai";
import { chatbot } from "./prompts/chatbot";
import { NewsItem } from "@proemial/adapters/redis/news";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages, item } = (await req.json()) as {
		messages: { role: "user" | "assistant"; content: string }[];
		item: NewsItem;
	};

	if (!item) {
		return new Response("Item not found", { status: 404 });
	}

	const result = await chatbot(item, convertToCoreMessages(messages));
	return result.toDataStreamResponse();
}
