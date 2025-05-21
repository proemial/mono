import { Message, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const POST = async (req: Request) => {
	try {
		const body = await req.json();
		const messages = body.messages as Message[];
		if (!messages || !Array.isArray(messages) || messages.length === 0) {
			return new Response("Missing or invalid 'messages' array", {
				status: 400,
			});
		}

		const result = await streamText({
			model: openai("gpt-4o"),
			messages,
		});
		return result.toDataStreamResponse();
	} catch (err) {
		return new Response("Invalid request body", { status: 400 });
	}
};
