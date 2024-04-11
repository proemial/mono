import { chatInputMaxLength } from "@/app/api/bot/input-limit";
import { context, model, question } from "@/app/prompts/chat";
import { openAIApiKey, openaiOrganizations } from "@/app/prompts/openai-keys";
import { OpenAIStream, StreamingTextResponse } from "ai";
import type { NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
	apiKey: openAIApiKey,
	organization: openaiOrganizations.read,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: NextRequest) {
	const { messages, title, abstract } = await req.json();

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
	const stream = OpenAIStream(response);
	// Respond with the stream
	return new StreamingTextResponse(stream);
}
